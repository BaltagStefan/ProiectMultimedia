package ro.autoassist.appointment.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import ro.autoassist.appointment.dto.AppointmentDtos;

@Repository
public class AppointmentRepository {
    private final JdbcTemplate jdbc;
    public AppointmentRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public AppointmentDtos.View create(AppointmentDtos.Create input, String keycloakId) {
        Long userId = jdbc.query("SELECT id FROM users_local WHERE keycloak_id = ?",
            rs -> rs.next() ? rs.getLong(1) : null, keycloakId);
        KeyHolder key = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement statement = connection.prepareStatement("""
                INSERT INTO appointments(user_id, service_id, car_id, part_id, appointment_time, description)
                VALUES (?, ?, ?, ?, ?, ?)
                """, Statement.RETURN_GENERATED_KEYS);
            if (userId == null) statement.setNull(1, java.sql.Types.BIGINT); else statement.setLong(1, userId);
            statement.setObject(2, input.serviceId());
            statement.setObject(3, input.carId());
            statement.setObject(4, input.partId());
            statement.setObject(5, input.appointmentTime());
            statement.setString(6, input.description());
            return statement;
        }, key);
        return findById(key.getKey().longValue());
    }

    public List<AppointmentDtos.View> all() {
        return jdbc.query(selectSql() + " ORDER BY a.appointment_time", this::map);
    }

    public AppointmentDtos.View findById(Long id) {
        return jdbc.query(selectSql() + " WHERE a.id = ?", this::map, id).stream().findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Programarea nu există."));
    }

    public AppointmentDtos.View updateStatus(Long id, String status) {
        jdbc.update("UPDATE appointments SET status = ? WHERE id = ?", status, id);
        return findById(id);
    }

    private String selectSql() {
        return """
            SELECT a.id, a.service_id, s.name service_name, a.car_id, a.part_id,
                   a.appointment_time, a.status, a.description
            FROM appointments a LEFT JOIN services s ON s.id = a.service_id
            """;
    }

    private AppointmentDtos.View map(java.sql.ResultSet rs, int row) throws java.sql.SQLException {
        return new AppointmentDtos.View(
            rs.getLong("id"), nullableLong(rs, "service_id"), rs.getString("service_name"),
            nullableLong(rs, "car_id"), nullableLong(rs, "part_id"),
            rs.getObject("appointment_time", OffsetDateTime.class), rs.getString("status"),
            rs.getString("description"));
    }

    private Long nullableLong(java.sql.ResultSet rs, String column) throws java.sql.SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }
}

