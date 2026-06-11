package ro.autoassist.vehicle.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import ro.autoassist.vehicle.dto.VehicleDtos;

@Repository
public class VehicleRepository {
    private final JdbcTemplate jdbc;

    public VehicleRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<VehicleDtos.Brand> brands() {
        return jdbc.query("SELECT id, name FROM car_brands ORDER BY name",
            (rs, row) -> new VehicleDtos.Brand(rs.getLong("id"), rs.getString("name")));
    }

    public List<VehicleDtos.Car> cars(String brand) {
        String sql = "SELECT id, brand, model, year, engine, fuel_type FROM cars " +
            (brand == null || brand.isBlank() ? "" : "WHERE brand = ? ") + "ORDER BY model";
        if (brand == null || brand.isBlank()) {
            return jdbc.query(sql, this::mapCar);
        }
        return jdbc.query(sql, this::mapCar, brand);
    }

    public List<VehicleDtos.Zone> zones() {
        return jdbc.query("""
            SELECT id, code, name, description, model_3d_node_name
            FROM vehicle_zones ORDER BY id
            """, (rs, row) -> new VehicleDtos.Zone(
                rs.getLong("id"), rs.getString("code"), rs.getString("name"),
                rs.getString("description"), rs.getString("model_3d_node_name")));
    }

    public VehicleDtos.UserCar addCar(VehicleDtos.AddCarRequest request, String keycloakId) {
        KeyHolder carKey = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement statement = connection.prepareStatement("""
                INSERT INTO cars(brand, model, year, engine, fuel_type) VALUES (?, ?, ?, ?, ?)
                """, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, request.brand());
            statement.setString(2, request.model());
            statement.setInt(3, request.year());
            statement.setString(4, request.engine());
            statement.setString(5, request.fuelType());
            return statement;
        }, carKey);
        long carId = carKey.getKey().longValue();

        Long userId = jdbc.query("""
            SELECT id FROM users_local WHERE keycloak_id = ?
            """, rs -> rs.next() ? rs.getLong("id") : null, keycloakId);
        KeyHolder userCarKey = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement statement = connection.prepareStatement("""
                INSERT INTO user_cars(user_id, car_id, plate_number, vin_optional) VALUES (?, ?, ?, ?)
                """, Statement.RETURN_GENERATED_KEYS);
            if (userId == null) statement.setNull(1, java.sql.Types.BIGINT);
            else statement.setLong(1, userId);
            statement.setLong(2, carId);
            statement.setString(3, request.plateNumber());
            statement.setString(4, request.vinOptional());
            return statement;
        }, userCarKey);
        return new VehicleDtos.UserCar(userCarKey.getKey().longValue(), carId, request.brand(),
            request.model(), request.year(), request.engine(), request.plateNumber(), request.vinOptional());
    }

    public List<VehicleDtos.UserCar> userCars(String keycloakId) {
        return jdbc.query("""
            SELECT uc.id, c.id car_id, c.brand, c.model, c.year, c.engine, uc.plate_number, uc.vin_optional
            FROM user_cars uc JOIN cars c ON c.id = uc.car_id
            LEFT JOIN users_local u ON u.id = uc.user_id
            WHERE u.keycloak_id = ? OR uc.user_id IS NULL
            ORDER BY uc.created_at DESC
            """, (rs, row) -> new VehicleDtos.UserCar(
                rs.getLong("id"), rs.getLong("car_id"), rs.getString("brand"), rs.getString("model"),
                rs.getInt("year"), rs.getString("engine"), rs.getString("plate_number"),
                rs.getString("vin_optional")), keycloakId);
    }

    private VehicleDtos.Car mapCar(java.sql.ResultSet rs, int row) throws java.sql.SQLException {
        return new VehicleDtos.Car(rs.getLong("id"), rs.getString("brand"), rs.getString("model"),
            rs.getInt("year"), rs.getString("engine"), rs.getString("fuel_type"));
    }
}

