package ro.autoassist.chat.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ro.autoassist.chat.dto.ChatDtos;
import ro.autoassist.chat.service.ChatService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final ChatService service;
    public NotificationController(ChatService service) { this.service = service; }

    @GetMapping
    public List<ChatDtos.Notification> all(@AuthenticationPrincipal Jwt jwt,
                                           Authentication authentication) {
        return service.notifications(jwt.getSubject(), role(authentication));
    }

    @GetMapping("/unread")
    public ChatDtos.UnreadSummary unread(@AuthenticationPrincipal Jwt jwt,
                                         Authentication authentication) {
        return service.unread(jwt.getSubject(), role(authentication));
    }

    @PutMapping("/{id}/read")
    public void read(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt,
                     Authentication authentication) {
        service.markNotificationRead(id, jwt.getSubject(), role(authentication));
    }

    @PutMapping("/read-all")
    public void readAll(@AuthenticationPrincipal Jwt jwt, Authentication authentication) {
        service.markAllNotificationsRead(jwt.getSubject(), role(authentication));
    }

    private String role(Authentication authentication) {
        return authentication.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_MECHANIC") ||
                                   authority.getAuthority().equals("ROLE_ADMIN"))
            ? "MECHANIC" : "USER";
    }
}
