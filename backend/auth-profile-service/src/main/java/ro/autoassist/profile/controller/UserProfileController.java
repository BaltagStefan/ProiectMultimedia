package ro.autoassist.profile.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ro.autoassist.profile.entity.UserProfile;
import ro.autoassist.profile.service.UserProfileService;

@RestController
@RequestMapping("/api")
public class UserProfileController {
    private final UserProfileService service;

    public UserProfileController(UserProfileService service) {
        this.service = service;
    }

    @GetMapping("/me")
    public UserProfile me(@AuthenticationPrincipal Jwt jwt) {
        return service.synchronize(jwt);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserProfile> users() {
        return service.findAll();
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MECHANIC')")
    public UserProfile user(@PathVariable Long id) {
        return service.findById(id);
    }
}

