package ro.autoassist.chat.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ro.autoassist.chat.dto.ChatDtos;
import ro.autoassist.chat.repository.ChatRepository;

@Service
public class ChatService {
    private final ChatRepository repository;
    public ChatService(ChatRepository repository) { this.repository = repository; }

    @Transactional
    public ChatDtos.Conversation create(ChatDtos.CreateConversation input, String subject,
                                        String username, String role) {
        if (input.serviceId() == null) throw new IllegalArgumentException("Service-ul este obligatoriu.");
        if (!role.equals("USER")) throw new IllegalArgumentException("Conversația este inițiată de utilizator.");
        return repository.create(input.serviceId(), subject, username, role);
    }

    public List<ChatDtos.Conversation> conversations(String subject, String role) {
        return repository.conversations(subject, role);
    }

    public List<ChatDtos.Message> messages(Long conversationId, String subject, String role) {
        repository.assertAccess(conversationId, subject, role);
        return repository.messages(conversationId, subject);
    }

    @Transactional
    public ChatDtos.Message message(Long conversationId, ChatDtos.CreateMessage input,
                                    String subject, String username, String role) {
        repository.assertAccess(conversationId, subject, role);
        if ((input.content() == null || input.content().isBlank()) && input.mediaId() == null) {
            throw new IllegalArgumentException("Mesajul sau atașamentul este obligatoriu.");
        }
        return repository.message(conversationId, input, subject, username, role);
    }

    @Transactional
    public void markRead(Long conversationId, String subject, String role) {
        repository.assertAccess(conversationId, subject, role);
        repository.markRead(conversationId, subject);
    }

    public List<ChatDtos.Notification> notifications(String subject, String role) {
        return repository.notifications(subject, role);
    }

    public ChatDtos.UnreadSummary unread(String subject, String role) {
        return repository.unread(subject, role);
    }

    public void markNotificationRead(Long id, String subject, String role) {
        repository.markNotificationRead(id, subject, role);
    }

    public void markAllNotificationsRead(String subject, String role) {
        repository.markAllNotificationsRead(subject, role);
    }
}
