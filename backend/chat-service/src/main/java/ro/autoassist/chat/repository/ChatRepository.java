package ro.autoassist.chat.repository;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import ro.autoassist.chat.dto.ChatDtos;

@Repository
public class ChatRepository {
    private final JdbcTemplate jdbc;
    public ChatRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public ChatDtos.Conversation create(Long serviceId, String subject, String username, String role) {
        List<Long> existing = jdbc.query("""
            SELECT id FROM conversations WHERE service_id = ? AND user_subject = ?
            ORDER BY created_at DESC LIMIT 1
            """, (rs, row) -> rs.getLong(1), serviceId, subject);
        if (!existing.isEmpty()) return conversation(existing.getFirst(), subject, role);

        Long id = jdbc.queryForObject("""
            INSERT INTO conversations(service_id, user_subject, user_name)
            VALUES (?, ?, ?) RETURNING id
            """, Long.class, serviceId, subject, username);
        return conversation(id, subject, role);
    }

    public List<ChatDtos.Conversation> conversations(String subject, String role) {
        String access = role.equals("MECHANIC") ? "" : " WHERE c.user_subject = ? ";
        Object[] args = role.equals("MECHANIC") ? new Object[] {} : new Object[] { subject };
        return jdbc.query("""
            SELECT c.id, c.service_id, s.name service_name, s.phone service_phone, c.user_name,
                   c.created_at,
                   (SELECT m.content FROM messages m WHERE m.conversation_id = c.id
                    ORDER BY m.created_at DESC LIMIT 1) last_message,
                   (SELECT m.created_at FROM messages m WHERE m.conversation_id = c.id
                    ORDER BY m.created_at DESC LIMIT 1) last_message_at,
                   (SELECT COUNT(*)::int FROM messages m
                    WHERE m.conversation_id = c.id
                      AND m.sender_subject IS DISTINCT FROM ?
                      AND NOT EXISTS (
                          SELECT 1 FROM message_reads mr
                          WHERE mr.message_id = m.id AND mr.reader_subject = ?
                      )) unread_count
            FROM conversations c
            LEFT JOIN services s ON s.id = c.service_id
            """ + access + " ORDER BY COALESCE((SELECT MAX(m.created_at) FROM messages m WHERE m.conversation_id = c.id), c.created_at) DESC",
            (rs, row) -> new ChatDtos.Conversation(
                rs.getLong("id"), nullableLong(rs, "service_id"), rs.getString("service_name"),
                rs.getString("service_phone"), rs.getString("user_name"),
                rs.getObject("created_at", OffsetDateTime.class), rs.getString("last_message"),
                rs.getObject("last_message_at", OffsetDateTime.class), rs.getInt("unread_count")),
            prepend(subject, subject, args));
    }

    public ChatDtos.Conversation conversation(Long id, String subject, String role) {
        return conversations(subject, role).stream().filter(item -> item.id().equals(id)).findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Conversația nu există."));
    }

    public void assertAccess(Long conversationId, String subject, String role) {
        Integer count = role.equals("MECHANIC")
            ? jdbc.queryForObject("SELECT COUNT(*) FROM conversations WHERE id = ?", Integer.class, conversationId)
            : jdbc.queryForObject("""
                SELECT COUNT(*) FROM conversations WHERE id = ? AND user_subject = ?
                """, Integer.class, conversationId, subject);
        if (count == null || count == 0) throw new IllegalArgumentException("Conversația nu există.");
    }

    public ChatDtos.Message message(Long conversationId, ChatDtos.CreateMessage input,
                                    String subject, String username, String role) {
        Long id = jdbc.queryForObject("""
            INSERT INTO messages(
                conversation_id, sender_subject, sender_name, sender_role, content, message_type, media_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id
            """, Long.class, conversationId, subject, username, role, input.content(),
            input.messageType() == null ? "TEXT" : input.messageType(), input.mediaId());

        ConversationOwner owner = jdbc.query("""
            SELECT user_subject, user_name FROM conversations WHERE id = ?
            """, rs -> rs.next() ? new ConversationOwner(rs.getString(1), rs.getString(2)) : null,
            conversationId);
        if (owner != null) {
            if (role.equals("MECHANIC")) {
                notify(owner.subject(), null, "CHAT", "Mesaj nou de la service",
                    preview(input.content()), "CONVERSATION", conversationId);
            } else {
                notify(null, "MECHANIC", "CHAT", "Mesaj nou de la " + username,
                    preview(input.content()), "CONVERSATION", conversationId);
            }
        }
        return messages(conversationId, subject).stream().filter(item -> item.id().equals(id))
            .findFirst().orElseThrow();
    }

    public List<ChatDtos.Message> messages(Long conversationId, String subject) {
        return jdbc.query("""
            SELECT m.id, m.conversation_id, m.content, m.message_type, m.media_id,
                   f.original_file_name media_name, f.mime_type media_mime_type,
                   m.sender_name, m.sender_role, m.sender_subject, m.created_at
            FROM messages m
            LEFT JOIN media_files f ON f.id = m.media_id
            WHERE m.conversation_id = ?
            ORDER BY m.created_at
            """, (rs, row) -> new ChatDtos.Message(
                rs.getLong("id"), rs.getLong("conversation_id"), rs.getString("content"),
                rs.getString("message_type"), nullableLong(rs, "media_id"),
                rs.getString("media_name"), rs.getString("media_mime_type"),
                rs.getString("sender_name"), rs.getString("sender_role"),
                subject.equals(rs.getString("sender_subject")),
                rs.getObject("created_at", OffsetDateTime.class)), conversationId);
    }

    public void markRead(Long conversationId, String subject) {
        jdbc.update("""
            INSERT INTO message_reads(message_id, reader_subject)
            SELECT m.id, ? FROM messages m
            WHERE m.conversation_id = ? AND m.sender_subject IS DISTINCT FROM ?
            ON CONFLICT (message_id, reader_subject) DO NOTHING
            """, subject, conversationId, subject);
    }

    public List<ChatDtos.Notification> notifications(String subject, String role) {
        return jdbc.query("""
            SELECT n.id, n.type, n.title, n.message, n.entity_type, n.entity_id, n.created_at,
                   EXISTS (
                       SELECT 1 FROM notification_reads nr
                       WHERE nr.notification_id = n.id AND nr.reader_subject = ?
                   ) is_read
            FROM notifications n
            WHERE n.recipient_subject = ? OR n.recipient_role = ?
            ORDER BY n.created_at DESC
            LIMIT 80
            """, (rs, row) -> new ChatDtos.Notification(
                rs.getLong("id"), rs.getString("type"), rs.getString("title"),
                rs.getString("message"), rs.getString("entity_type"),
                nullableLong(rs, "entity_id"), rs.getBoolean("is_read"),
                rs.getObject("created_at", OffsetDateTime.class)), subject, subject, role);
    }

    public ChatDtos.UnreadSummary unread(String subject, String role) {
        Integer messages = jdbc.queryForObject("""
            SELECT COUNT(*)::int
            FROM messages m
            JOIN conversations c ON c.id = m.conversation_id
            WHERE (? = 'MECHANIC' OR c.user_subject = ?)
              AND m.sender_subject IS DISTINCT FROM ?
              AND NOT EXISTS (
                  SELECT 1 FROM message_reads mr
                  WHERE mr.message_id = m.id AND mr.reader_subject = ?
              )
            """, Integer.class, role, subject, subject, subject);
        Integer notifications = jdbc.queryForObject("""
            SELECT COUNT(*)::int FROM notifications n
            WHERE (n.recipient_subject = ? OR n.recipient_role = ?)
              AND NOT EXISTS (
                  SELECT 1 FROM notification_reads nr
                  WHERE nr.notification_id = n.id AND nr.reader_subject = ?
              )
            """, Integer.class, subject, role, subject);
        int messageCount = messages == null ? 0 : messages;
        int notificationCount = notifications == null ? 0 : notifications;
        return new ChatDtos.UnreadSummary(messageCount, notificationCount,
            messageCount + notificationCount);
    }

    public void markNotificationRead(Long id, String subject, String role) {
        Integer allowed = jdbc.queryForObject("""
            SELECT COUNT(*) FROM notifications
            WHERE id = ? AND (recipient_subject = ? OR recipient_role = ?)
            """, Integer.class, id, subject, role);
        if (allowed == null || allowed == 0) throw new IllegalArgumentException("Notificarea nu există.");
        jdbc.update("""
            INSERT INTO notification_reads(notification_id, reader_subject)
            VALUES (?, ?) ON CONFLICT DO NOTHING
            """, id, subject);
    }

    public void markAllNotificationsRead(String subject, String role) {
        jdbc.update("""
            INSERT INTO notification_reads(notification_id, reader_subject)
            SELECT n.id, ? FROM notifications n
            WHERE n.recipient_subject = ? OR n.recipient_role = ?
            ON CONFLICT DO NOTHING
            """, subject, subject, role);
    }

    private void notify(String recipientSubject, String recipientRole, String type, String title,
                        String message, String entityType, Long entityId) {
        jdbc.update("""
            INSERT INTO notifications(
                recipient_subject, recipient_role, type, title, message, entity_type, entity_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, recipientSubject, recipientRole, type, title, message, entityType, entityId);
    }

    private String preview(String content) {
        if (content == null || content.isBlank()) return "Ai primit un atașament.";
        return content.length() > 140 ? content.substring(0, 140) + "..." : content;
    }

    private Object[] prepend(Object first, Object second, Object[] rest) {
        Object[] result = new Object[rest.length + 2];
        result[0] = first;
        result[1] = second;
        System.arraycopy(rest, 0, result, 2, rest.length);
        return result;
    }

    private Long nullableLong(java.sql.ResultSet rs, String column) throws java.sql.SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }

    private record ConversationOwner(String subject, String username) {}
}
