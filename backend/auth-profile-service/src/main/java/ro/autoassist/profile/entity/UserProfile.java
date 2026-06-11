package ro.autoassist.profile.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users_local")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "keycloak_id", nullable = false, unique = true)
    private String keycloakId;

    @Column(nullable = false)
    private String username;

    private String email;

    @Column(nullable = false)
    private String role;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getKeycloakId() { return keycloakId; }
    public void setKeycloakId(String keycloakId) { this.keycloakId = keycloakId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Instant getCreatedAt() { return createdAt; }
}

