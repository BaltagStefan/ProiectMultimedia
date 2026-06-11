package ro.autoassist.profile.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ro.autoassist.profile.entity.UserProfile;
import ro.autoassist.profile.repository.UserProfileRepository;

@Service
public class UserProfileService {
    private final UserProfileRepository repository;

    public UserProfileService(UserProfileRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public UserProfile synchronize(Jwt jwt) {
        UserProfile profile = repository.findByKeycloakId(jwt.getSubject()).orElseGet(UserProfile::new);
        profile.setKeycloakId(jwt.getSubject());
        profile.setUsername(jwt.getClaimAsString("preferred_username"));
        profile.setEmail(jwt.getClaimAsString("email"));
        profile.setRole(primaryRole(jwt));
        return repository.save(profile);
    }

    public List<UserProfile> findAll() {
        return repository.findAll();
    }

    public UserProfile findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Utilizatorul nu există."));
    }

    @SuppressWarnings("unchecked")
    private String primaryRole(Jwt jwt) {
        Map<String, Object> access = jwt.getClaimAsMap("realm_access");
        List<String> roles = access == null ? List.of() : (List<String>) access.getOrDefault("roles", List.of());
        if (roles.contains("ADMIN")) return "ADMIN";
        if (roles.contains("MECHANIC")) return "MECHANIC";
        return "USER";
    }
}

