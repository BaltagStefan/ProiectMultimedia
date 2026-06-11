package ro.autoassist.appointment.repository;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import ro.autoassist.appointment.dto.AppointmentDtos;

@Repository
public class AppointmentRepository {
    private final JdbcTemplate jdbc;
    public AppointmentRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public AppointmentDtos.View create(AppointmentDtos.Create input, String keycloakId, String username) {
        Long userId = jdbc.query("SELECT id FROM users_local WHERE keycloak_id = ?",
            rs -> rs.next() ? rs.getLong(1) : null, keycloakId);
        Long id = jdbc.queryForObject("""
            INSERT INTO appointments(user_id, user_subject, requester_name, service_id, car_id,
                                     part_id, appointment_time, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING id
            """, Long.class, userId, keycloakId, username, input.serviceId(), input.carId(),
            input.partId(), input.appointmentTime(), input.description());
        AppointmentDtos.View created = findById(id);
        notifyRole("MECHANIC", "APPOINTMENT", "Programare nouă",
            username + " a trimis o cerere de programare.", "APPOINTMENT", created.id());
        return created;
    }

    public List<AppointmentDtos.View> all() {
        return jdbc.query(selectSql() + " ORDER BY a.appointment_time", this::map);
    }

    public List<AppointmentDtos.View> mine(String subject) {
        return jdbc.query(selectSql() + " WHERE a.user_subject = ? ORDER BY a.appointment_time",
            this::map, subject);
    }

    public AppointmentDtos.View findById(Long id) {
        return jdbc.query(selectSql() + " WHERE a.id = ?", this::map, id).stream().findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Programarea nu există."));
    }

    public AppointmentDtos.View updateStatus(Long id, String status) {
        AppointmentOwner owner = jdbc.query("""
            SELECT user_subject, requester_name FROM appointments WHERE id = ?
            """, rs -> rs.next() ? new AppointmentOwner(rs.getString(1), rs.getString(2)) : null, id);
        if (owner == null) throw new IllegalArgumentException("Programarea nu există.");
        jdbc.update("UPDATE appointments SET status = ? WHERE id = ?", status, id);
        AppointmentDtos.View updated = findById(id);
        if (owner.subject() != null) {
            notifySubject(owner.subject(), "APPOINTMENT_STATUS", "Status programare actualizat",
                statusMessage(status), "APPOINTMENT", id);
        }
        return updated;
    }

    public AppointmentDtos.View cancelOwn(Long id, String subject) {
        int changed = jdbc.update("""
            UPDATE appointments SET status = 'CANCELED'
            WHERE id = ? AND user_subject = ? AND status IN ('PENDING', 'ACCEPTED')
            """, id, subject);
        if (changed == 0) {
            throw new IllegalArgumentException("Programarea nu poate fi anulată.");
        }
        AppointmentDtos.View updated = findById(id);
        notifyRole("MECHANIC", "APPOINTMENT_STATUS", "Programare anulată",
            (updated.requesterName() == null ? "Utilizatorul" : updated.requesterName()) +
                " a anulat programarea.", "APPOINTMENT", id);
        return updated;
    }

    private String selectSql() {
        return """
            SELECT a.id, a.service_id, s.name service_name, a.car_id, a.part_id,
                   a.appointment_time, a.status, a.description, a.requester_name
            FROM appointments a LEFT JOIN services s ON s.id = a.service_id
            """;
    }

    private AppointmentDtos.View map(java.sql.ResultSet rs, int row) throws java.sql.SQLException {
        return new AppointmentDtos.View(
            rs.getLong("id"), nullableLong(rs, "service_id"), rs.getString("service_name"),
            nullableLong(rs, "car_id"), nullableLong(rs, "part_id"),
            rs.getObject("appointment_time", OffsetDateTime.class), rs.getString("status"),
            rs.getString("description"), rs.getString("requester_name"));
    }

    private void notifyRole(String role, String type, String title, String message,
                            String entityType, Long entityId) {
        jdbc.update("""
            INSERT INTO notifications(recipient_role, type, title, message, entity_type, entity_id)
            VALUES (?, ?, ?, ?, ?, ?)
            """, role, type, title, message, entityType, entityId);
    }

    private void notifySubject(String subject, String type, String title, String message,
                               String entityType, Long entityId) {
        jdbc.update("""
            INSERT INTO notifications(recipient_subject, type, title, message, entity_type, entity_id)
            VALUES (?, ?, ?, ?, ?, ?)
            """, subject, type, title, message, entityType, entityId);
    }

    private String statusMessage(String status) {
        return switch (status) {
            case "ACCEPTED" -> "Programarea a fost acceptată de service.";
            case "REJECTED" -> "Programarea a fost respinsă de service.";
            case "COMPLETED" -> "Lucrarea programată a fost marcată ca finalizată.";
            case "CANCELED" -> "Programarea a fost anulată.";
            default -> "Programarea este în așteptarea confirmării.";
        };
    }

    private record AppointmentOwner(String subject, String username) {}

    private Long nullableLong(java.sql.ResultSet rs, String column) throws java.sql.SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }
}
