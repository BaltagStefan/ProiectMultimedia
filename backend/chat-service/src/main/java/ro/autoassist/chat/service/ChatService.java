package ro.autoassist.chat.service;

import java.util.List;

import org.springframework.stereotype.Service;

import ro.autoassist.chat.dto.ChatDtos;
import ro.autoassist.chat.repository.ChatRepository;

@Service
public class ChatService {
    private final ChatRepository repository;
    public ChatService(ChatRepository repository) { this.repository = repository; }
    public ChatDtos.Conversation create(ChatDtos.CreateConversation input) {
        return repository.create(input.serviceId());
    }
    public List<ChatDtos.Conversation> conversations() { return repository.conversations(); }
    public List<ChatDtos.Message> messages(Long conversationId) { return repository.messages(conversationId); }
    public ChatDtos.Message message(Long conversationId, ChatDtos.CreateMessage input) {
        return repository.message(conversationId, input);
    }
}

