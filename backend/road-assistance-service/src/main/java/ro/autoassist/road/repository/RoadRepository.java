package ro.autoassist.road.repository;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import ro.autoassist.road.dto.RoadDtos;

@Repository
public class RoadRepository {
    private final JdbcTemplate jdbc;
    public RoadRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public RoadDtos.View create(RoadDtos.Create input) {
        Long id = jdbc.queryForObject("""
            INSERT INTO road_assistance_requests(assigned_service_id, latitude, longitude, problem_description)
            VALUES (?, ?, ?, ?) RETURNING id
            """, Long.class, input.assignedServiceId(), input.latitude(), input.longitude(),
            input.problemDescription());
        return one(id);
    }

    public List<RoadDtos.View> all() {
        return jdbc.query("""
            SELECT r.id, r.assigned_service_id, s.name service_name, r.latitude, r.longitude,
                   r.problem_description, r.status, r.created_at
            FROM road_assistance_requests r
            LEFT JOIN services s ON s.id = r.assigned_service_id
            ORDER BY r.created_at DESC
            """, (rs, row) -> new RoadDtos.View(
                rs.getLong("id"), nullableLong(rs, "assigned_service_id"), rs.getString("service_name"),
                rs.getDouble("latitude"), rs.getDouble("longitude"),
                rs.getString("problem_description"), rs.getString("status"),
                rs.getObject("created_at", OffsetDateTime.class)));
    }

    public RoadDtos.View one(Long id) {
        return all().stream().filter(item -> item.id().equals(id)).findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Cererea nu există."));
    }

    public RoadDtos.View status(Long id, String status) {
        jdbc.update("UPDATE road_assistance_requests SET status = ? WHERE id = ?", status, id);
        return one(id);
    }

    private Long nullableLong(java.sql.ResultSet rs, String column) throws java.sql.SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }
}

