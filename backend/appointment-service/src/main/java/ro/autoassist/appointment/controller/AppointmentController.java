package ro.autoassist.appointment.controller;

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

import ro.autoassist.appointment.dto.AppointmentDtos;
import ro.autoassist.appointment.service.AppointmentService;

@RestController
@RequestMapping("/api")
public class AppointmentController {
    private final AppointmentService service;
    public AppointmentController(AppointmentService service) { this.service = service; }

    @PostMapping("/appointments")
    public AppointmentDtos.View create(@RequestBody AppointmentDtos.Create input,
                                        @AuthenticationPrincipal Jwt jwt) {
        return service.create(input, jwt.getSubject());
    }

    @GetMapping("/users/me/appointments")
    public List<AppointmentDtos.View> mine() { return service.all(); }

    @GetMapping("/mechanic/appointments")
    @PreAuthorize("hasAnyRole('MECHANIC', 'ADMIN')")
    public List<AppointmentDtos.View> mechanic() { return service.all(); }

    @PutMapping("/mechanic/appointments/{id}/status")
    @PreAuthorize("hasAnyRole('MECHANIC', 'ADMIN')")
    public AppointmentDtos.View status(@PathVariable Long id,
                                       @RequestBody AppointmentDtos.StatusUpdate input) {
        return service.status(id, input.status());
    }
}

