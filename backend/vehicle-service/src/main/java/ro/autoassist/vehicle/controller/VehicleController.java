package ro.autoassist.vehicle.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ro.autoassist.vehicle.dto.VehicleDtos;
import ro.autoassist.vehicle.service.VehicleService;

@RestController
@RequestMapping("/api")
public class VehicleController {
    private final VehicleService service;

    public VehicleController(VehicleService service) {
        this.service = service;
    }

    @GetMapping("/car-brands")
    public List<VehicleDtos.Brand> brands() { return service.brands(); }

    @GetMapping("/car-models")
    public List<VehicleDtos.Car> cars(@RequestParam(required = false) String brand) {
        return service.cars(brand);
    }

    @GetMapping("/vehicle-zones")
    public List<VehicleDtos.Zone> zones() { return service.zones(); }

    @PostMapping("/users/me/cars")
    public VehicleDtos.UserCar add(@RequestBody VehicleDtos.AddCarRequest request,
                                   @AuthenticationPrincipal Jwt jwt) {
        return service.addCar(request, jwt.getSubject());
    }

    @GetMapping("/users/me/cars")
    public List<VehicleDtos.UserCar> mine(@AuthenticationPrincipal Jwt jwt) {
        return service.userCars(jwt.getSubject());
    }
}

