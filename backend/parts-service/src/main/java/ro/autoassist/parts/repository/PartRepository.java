package ro.autoassist.parts.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ro.autoassist.parts.entity.Part;

public interface PartRepository extends JpaRepository<Part, Long> {
    List<Part> findAllByOrderByCreatedAtDesc();
    List<Part> findByNameContainingIgnoreCaseOrderByCreatedAtDesc(String query);
    List<Part> findByZoneIdOrderByCreatedAtDesc(Long zoneId);
    List<Part> findByZoneIdAndNameContainingIgnoreCaseOrderByCreatedAtDesc(Long zoneId, String query);
}
