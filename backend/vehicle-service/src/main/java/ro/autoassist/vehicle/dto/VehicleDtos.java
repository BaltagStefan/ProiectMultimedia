package ro.autoassist.vehicle.dto;

public final class VehicleDtos {
    private VehicleDtos() {}

    public record Brand(Long id, String name) {}
    public record Car(Long id, String brand, String model, Integer year, String engine, String fuelType) {}
    public record Zone(Long id, String code, String name, String description, String model3dNodeName) {}
    public record AddCarRequest(
        String brand,
        String model,
        Integer year,
        String engine,
        String fuelType,
        String plateNumber,
        String vinOptional
    ) {}
    public record UserCar(Long id, Long carId, String brand, String model, Integer year,
                          String engine, String plateNumber, String vinOptional) {}
}

