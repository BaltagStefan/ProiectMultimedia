package ro.autoassist.chat.dto;

import java.time.OffsetDateTime;

public final class ChatDtos {
    private ChatDtos() {}
    public record CreateConversation(Long serviceId) {}
    public record Conversation(Long id, Long serviceId, String serviceName, OffsetDateTime createdAt) {}
    public record CreateMessage(String content, String messageType, Long mediaId) {}
    public record Message(Long id, Long conversationId, String content, String messageType,
                          Long mediaId, OffsetDateTime createdAt) {}
}

