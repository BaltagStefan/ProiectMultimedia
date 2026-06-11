package ro.autoassist.locator.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ro.autoassist.locator.dto.AutoServiceDto;
import ro.autoassist.locator.service.AutoServiceService;

@RestController
@RequestMapping("/api/services")
public class AutoServiceController {
    private final AutoServiceService service;
    public AutoServiceController(AutoServiceService service) { this.service = service; }

    @GetMapping
    public List<AutoServiceDto> all() { return service.all(); }

    @GetMapping("/nearby")
    public List<AutoServiceDto> nearby(@RequestParam double lat, @RequestParam double lng) {
        return service.nearby(lat, lng);
    }

    @GetMapping("/{id}")
    public AutoServiceDto one(@PathVariable Long id) { return service.one(id); }
}

