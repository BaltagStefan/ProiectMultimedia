package ro.autoassist.chat.dto;

import java.time.OffsetDateTime;

public final class ChatDtos {
    private ChatDtos() {}

    public record CreateConversation(Long serviceId) {}
    public record Conversation(Long id, Long serviceId, String serviceName, String servicePhone,
                               String userName, OffsetDateTime createdAt, String lastMessage,
                               OffsetDateTime lastMessageAt, Integer unreadCount) {}
    public record CreateMessage(String content, String messageType, Long mediaId) {}
    public record Message(Long id, Long conversationId, String content, String messageType,
                          Long mediaId, String mediaName, String mediaMimeType, String senderName,
                          String senderRole, boolean mine, OffsetDateTime createdAt) {}
    public record Notification(Long id, String type, String title, String message, String entityType,
                               Long entityId, boolean read, OffsetDateTime createdAt) {}
    public record UnreadSummary(Integer messages, Integer notifications, Integer total) {}
}
