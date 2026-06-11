package ro.autoassist.chat.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    public ChatDtos.Conversation create(@RequestBody ChatDtos.CreateConversation input,
                                        @AuthenticationPrincipal Jwt jwt,
                                        Authentication authentication) {
        return service.create(input, jwt.getSubject(), username(jwt), role(authentication));
    }

    @GetMapping
    public List<ChatDtos.Conversation> conversations(@AuthenticationPrincipal Jwt jwt,
                                                     Authentication authentication) {
        return service.conversations(jwt.getSubject(), role(authentication));
    }

    @GetMapping("/{id}/messages")
    public List<ChatDtos.Message> messages(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt,
                                           Authentication authentication) {
        return service.messages(id, jwt.getSubject(), role(authentication));
    }

    @PostMapping("/{id}/messages")
    public ChatDtos.Message message(@PathVariable Long id,
                                    @RequestBody ChatDtos.CreateMessage input,
                                    @AuthenticationPrincipal Jwt jwt,
                                    Authentication authentication) {
        return service.message(id, input, jwt.getSubject(), username(jwt), role(authentication));
    }

    @PutMapping("/{id}/read")
    public void read(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt,
                     Authentication authentication) {
        service.markRead(id, jwt.getSubject(), role(authentication));
    }

    private String username(Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        return username == null || username.isBlank() ? "Utilizator" : username;
    }

    private String role(Authentication authentication) {
        return authentication.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_MECHANIC") ||
                                   authority.getAuthority().equals("ROLE_ADMIN"))
            ? "MECHANIC" : "USER";
    }
}
