package ro.autoassist.road.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ro.autoassist.road.dto.RoadDtos;
import ro.autoassist.road.service.RoadService;

@RestController
@RequestMapping("/api")
public class RoadController {
    private final RoadService service;
    public RoadController(RoadService service) { this.service = service; }

    @PostMapping("/road-assistance")
    public RoadDtos.View create(@RequestBody RoadDtos.Create input) { return service.create(input); }

    @GetMapping("/users/me/road-assistance")
    public List<RoadDtos.View> mine() { return service.all(); }

    @GetMapping("/mechanic/road-assistance")
    @PreAuthorize("hasAnyRole('MECHANIC', 'ADMIN')")
    public List<RoadDtos.View> mechanic() { return service.all(); }

    @PutMapping("/road-assistance/{id}/status")
    @PreAuthorize("hasAnyRole('MECHANIC', 'ADMIN')")
    public RoadDtos.View status(@PathVariable Long id, @RequestBody RoadDtos.StatusUpdate input) {
        return service.status(id, input.status());
    }
}

