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

    public RoadDtos.View create(RoadDtos.Create input, String subject, String username) {
        Long id = jdbc.queryForObject("""
            INSERT INTO road_assistance_requests(
                user_subject, requester_name, assigned_service_id, latitude, longitude,
                problem_type, problem_description, media_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
            """, Long.class, subject, username, input.assignedServiceId(), input.latitude(),
            input.longitude(), input.problemType(), input.problemDescription(), input.mediaId());
        RoadDtos.View created = one(id);
        jdbc.update("""
            INSERT INTO notifications(recipient_role, type, title, message, entity_type, entity_id)
            VALUES ('MECHANIC', 'ROAD_ASSISTANCE', 'Cerere rutieră nouă', ?, 'ROAD_ASSISTANCE', ?)
            """, username + ": " + input.problemDescription(), id);
        return created;
    }

    public List<RoadDtos.View> all() {
        return jdbc.query(selectSql() + " ORDER BY r.created_at DESC", this::map);
    }

    public List<RoadDtos.View> mine(String subject) {
        return jdbc.query(selectSql() + " WHERE r.user_subject = ? ORDER BY r.created_at DESC",
            this::map, subject);
    }

    public RoadDtos.View one(Long id) {
        return jdbc.query(selectSql() + " WHERE r.id = ?", this::map, id).stream().findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Cererea nu există."));
    }

    public RoadDtos.View status(Long id, String status) {
        String subject = jdbc.query("SELECT user_subject FROM road_assistance_requests WHERE id = ?",
            rs -> rs.next() ? rs.getString(1) : null, id);
        if (subject == null) throw new IllegalArgumentException("Cererea nu există.");
        jdbc.update("UPDATE road_assistance_requests SET status = ? WHERE id = ?", status, id);
        RoadDtos.View updated = one(id);
        jdbc.update("""
            INSERT INTO notifications(recipient_subject, type, title, message, entity_type, entity_id)
            VALUES (?, 'ROAD_STATUS', 'Status asistență actualizat', ?, 'ROAD_ASSISTANCE', ?)
            """, subject, statusMessage(status), id);
        return updated;
    }

    private String selectSql() {
        return """
            SELECT r.id, r.assigned_service_id, s.name service_name, r.latitude, r.longitude,
                   r.problem_description, r.status, r.created_at, r.requester_name, r.problem_type,
                   r.media_id, f.original_file_name media_name
            FROM road_assistance_requests r
            LEFT JOIN services s ON s.id = r.assigned_service_id
            LEFT JOIN media_files f ON f.id = r.media_id
            """;
    }

    private RoadDtos.View map(java.sql.ResultSet rs, int row) throws java.sql.SQLException {
        return new RoadDtos.View(
            rs.getLong("id"), nullableLong(rs, "assigned_service_id"), rs.getString("service_name"),
            rs.getDouble("latitude"), rs.getDouble("longitude"),
            rs.getString("problem_description"), rs.getString("status"),
            rs.getObject("created_at", OffsetDateTime.class), rs.getString("requester_name"),
            rs.getString("problem_type"), nullableLong(rs, "media_id"), rs.getString("media_name"));
    }

    private String statusMessage(String status) {
        return switch (status) {
            case "ASSIGNED" -> "O echipă a preluat cererea ta.";
            case "ON_THE_WAY" -> "Echipa de asistență este în drum spre tine.";
            case "IN_PROGRESS" -> "Intervenția este în desfășurare.";
            case "COMPLETED" -> "Intervenția a fost finalizată.";
            case "CANCELED" -> "Cererea de asistență a fost anulată.";
            default -> "Cererea a fost înregistrată.";
        };
    }

    private Long nullableLong(java.sql.ResultSet rs, String column) throws java.sql.SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }
}
