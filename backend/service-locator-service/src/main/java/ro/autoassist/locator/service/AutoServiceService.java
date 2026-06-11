package ro.autoassist.locator.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import ro.autoassist.locator.dto.AutoServiceDto;
import ro.autoassist.locator.repository.AutoServiceRepository;

@Service
public class AutoServiceService {
    private final AutoServiceRepository repository;
    public AutoServiceService(AutoServiceRepository repository) { this.repository = repository; }
    public List<AutoServiceDto> all() { return repository.findAll(); }
    public AutoServiceDto one(Long id) { return repository.findById(id); }
    public List<AutoServiceDto> nearby(double lat, double lng) {
        return repository.findAll().stream()
            .sorted(Comparator.comparingDouble(service ->
                Math.pow(service.latitude() - lat, 2) + Math.pow(service.longitude() - lng, 2)))
            .toList();
    }
}

