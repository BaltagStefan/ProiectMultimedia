package ro.autoassist.locator.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import ro.autoassist.locator.dto.AutoServiceDto;

@Repository
public class AutoServiceRepository {
    private static final String SELECT = """
        SELECT s.id, s.name, s.type, s.description, s.phone, s.email, s.rating,
               l.address, l.city, l.latitude, l.longitude
        FROM services s JOIN service_locations l ON l.service_id = s.id
        """;
    private final JdbcTemplate jdbc;

    public AutoServiceRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<AutoServiceDto> findAll() {
        return jdbc.query(SELECT + " ORDER BY s.rating DESC", this::map);
    }

    public AutoServiceDto findById(Long id) {
        return jdbc.query(SELECT + " WHERE s.id = ?", this::map, id).stream().findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Service-ul nu există."));
    }

    private AutoServiceDto map(java.sql.ResultSet rs, int row) throws java.sql.SQLException {
        return new AutoServiceDto(
            rs.getLong("id"), rs.getString("name"), rs.getString("type"),
            rs.getString("description"), rs.getString("phone"), rs.getString("email"),
            rs.getBigDecimal("rating"), rs.getString("address"), rs.getString("city"),
            rs.getDouble("latitude"), rs.getDouble("longitude")
        );
    }
}

