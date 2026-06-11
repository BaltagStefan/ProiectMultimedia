package ro.autoassist.profile.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ro.autoassist.profile.entity.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByKeycloakId(String keycloakId);
}

