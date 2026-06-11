package ro.autoassist.chat.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ro.autoassist.chat.dto.ChatDtos;
import ro.autoassist.chat.service.ChatService;

@RestController
@RequestMapping("/api/conversations")
public class ChatController {
    private final ChatService service;
    public ChatController(ChatService service) { this.service = service; }

    @PostMapping
    public ChatDtos.Conversation create(@RequestBody ChatDtos.CreateConversation input) {
        return service.create(input);
    }

    @GetMapping
    public List<ChatDtos.Conversation> conversations() { return service.conversations(); }

    @GetMapping("/{id}/messages")
    public List<ChatDtos.Message> messages(@PathVariable Long id) { return service.messages(id); }

    @PostMapping("/{id}/messages")
    public ChatDtos.Message message(@PathVariable Long id, @RequestBody ChatDtos.CreateMessage input) {
        return service.message(id, input);
    }
}

