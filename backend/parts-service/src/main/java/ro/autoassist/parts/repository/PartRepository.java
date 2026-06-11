package ro.autoassist.parts.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ro.autoassist.parts.entity.Part;

public interface PartRepository extends JpaRepository<Part, Long> {
    @Query("""
        SELECT p FROM Part p
        WHERE (:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
        AND (:zoneId IS NULL OR p.zoneId = :zoneId)
        """)
    List<Part> search(@Param("query") String query, @Param("zoneId") Long zoneId);
}

