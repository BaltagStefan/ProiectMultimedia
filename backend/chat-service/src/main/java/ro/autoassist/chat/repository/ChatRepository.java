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

    public ChatDtos.Conversation create(Long serviceId) {
        Long id = jdbc.queryForObject("""
            INSERT INTO conversations(service_id) VALUES (?) RETURNING id
            """, Long.class, serviceId);
        return conversation(id);
    }

    public List<ChatDtos.Conversation> conversations() {
        return jdbc.query("""
            SELECT c.id, c.service_id, s.name service_name, c.created_at
            FROM conversations c LEFT JOIN services s ON s.id = c.service_id ORDER BY c.created_at DESC
            """, (rs, row) -> new ChatDtos.Conversation(
                rs.getLong("id"), nullableLong(rs, "service_id"), rs.getString("service_name"),
                rs.getObject("created_at", OffsetDateTime.class)));
    }

    public ChatDtos.Conversation conversation(Long id) {
        return conversations().stream().filter(item -> item.id().equals(id)).findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Conversația nu există."));
    }

    public ChatDtos.Message message(Long conversationId, ChatDtos.CreateMessage input) {
        Long id = jdbc.queryForObject("""
            INSERT INTO messages(conversation_id, content, message_type, media_id)
            VALUES (?, ?, ?, ?) RETURNING id
            """, Long.class, conversationId, input.content(),
            input.messageType() == null ? "TEXT" : input.messageType(), input.mediaId());
        return messages(conversationId).stream().filter(message -> message.id().equals(id)).findFirst().orElseThrow();
    }

    public List<ChatDtos.Message> messages(Long conversationId) {
        return jdbc.query("""
            SELECT id, conversation_id, content, message_type, media_id, created_at
            FROM messages WHERE conversation_id = ? ORDER BY created_at
            """, (rs, row) -> new ChatDtos.Message(
                rs.getLong("id"), rs.getLong("conversation_id"), rs.getString("content"),
                rs.getString("message_type"), nullableLong(rs, "media_id"),
                rs.getObject("created_at", OffsetDateTime.class)), conversationId);
    }

    private Long nullableLong(java.sql.ResultSet rs, String column) throws java.sql.SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }
}

