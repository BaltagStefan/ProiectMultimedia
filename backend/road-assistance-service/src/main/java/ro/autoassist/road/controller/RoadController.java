package ro.autoassist.road.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
    public RoadDtos.View create(@RequestBody RoadDtos.Create input, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        return service.create(input, jwt.getSubject(), username == null ? "Utilizator" : username);
    }

    @GetMapping("/users/me/road-assistance")
    public List<RoadDtos.View> mine(@AuthenticationPrincipal Jwt jwt) {
        return service.mine(jwt.getSubject());
    }

    @GetMapping("/mechanic/road-assistance")
    @PreAuthorize("hasAnyRole('MECHANIC', 'ADMIN')")
    public List<RoadDtos.View> mechanic() { return service.all(); }

    @PutMapping("/road-assistance/{id}/status")
    @PreAuthorize("hasAnyRole('MECHANIC', 'ADMIN')")
    public RoadDtos.View status(@PathVariable Long id, @RequestBody RoadDtos.StatusUpdate input) {
        return service.status(id, input.status());
    }
}
