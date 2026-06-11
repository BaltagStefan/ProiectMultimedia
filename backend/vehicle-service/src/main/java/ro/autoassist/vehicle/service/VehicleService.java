package ro.autoassist.vehicle.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ro.autoassist.vehicle.dto.VehicleDtos;
import ro.autoassist.vehicle.repository.VehicleRepository;

@Service
public class VehicleService {
    private final VehicleRepository repository;

    public VehicleService(VehicleRepository repository) {
        this.repository = repository;
    }

    public List<VehicleDtos.Brand> brands() { return repository.brands(); }
    public List<VehicleDtos.Car> cars(String brand) { return repository.cars(brand); }
    public List<VehicleDtos.Zone> zones() { return repository.zones(); }
    public List<VehicleDtos.UserCar> userCars(String subject) { return repository.userCars(subject); }

    @Transactional
    public VehicleDtos.UserCar addCar(VehicleDtos.AddCarRequest request, String subject) {
        if (request.plateNumber() == null || request.plateNumber().isBlank()) {
            throw new IllegalArgumentException("Numărul de înmatriculare este obligatoriu.");
        }
        return repository.addCar(request, subject);
    }
}

