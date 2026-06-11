package ro.autoassist.road.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ro.autoassist.road.dto.RoadDtos;
import ro.autoassist.road.repository.RoadRepository;

@Service
public class RoadService {
    private static final Set<String> STATUSES =
        Set.of("NEW", "ASSIGNED", "ON_THE_WAY", "IN_PROGRESS", "COMPLETED", "CANCELED");
    private final RoadRepository repository;
    public RoadService(RoadRepository repository) { this.repository = repository; }

    @Transactional
    public RoadDtos.View create(RoadDtos.Create input, String subject, String username) {
        if (input.latitude() == null || input.longitude() == null ||
            input.problemDescription() == null || input.problemDescription().isBlank()) {
            throw new IllegalArgumentException("Locația și descrierea sunt obligatorii.");
        }
        return repository.create(input, subject, username);
    }

    public List<RoadDtos.View> all() { return repository.all(); }
    public List<RoadDtos.View> mine(String subject) { return repository.mine(subject); }

    @Transactional
    public RoadDtos.View status(Long id, String status) {
        if (!STATUSES.contains(status)) throw new IllegalArgumentException("Status necunoscut.");
        return repository.status(id, status);
    }
}
