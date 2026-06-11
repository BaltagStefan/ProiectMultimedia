package ro.autoassist.parts.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ro.autoassist.parts.entity.Part;
import ro.autoassist.parts.service.PartService;

@RestController
@RequestMapping("/api")
public class PartController {
    private final PartService service;

    public PartController(PartService service) { this.service = service; }

    @GetMapping("/parts")
    public List<Part> parts(@RequestParam(required = false) String query,
                            @RequestParam(required = false) Long zoneId) {
        return service.search(query, zoneId);
    }

    @GetMapping("/parts/search")
    public List<Part> search(@RequestParam(required = false) String zone,
                             @RequestParam(required = false) String model) {
        return service.search(model, null);
    }

    @GetMapping("/parts/{id}")
    public Part one(@PathVariable Long id) { return service.one(id); }

    @PostMapping("/mechanic/parts")
    @PreAuthorize("hasAnyRole('MECHANIC', 'ADMIN')")
    public Part create(@RequestBody Part part) { return service.save(part); }

    @PutMapping("/mechanic/parts/{id}")
    @PreAuthorize("hasAnyRole('MECHANIC', 'ADMIN')")
    public Part update(@PathVariable Long id, @RequestBody Part part) { return service.update(id, part); }

    @DeleteMapping("/mechanic/parts/{id}")
    @PreAuthorize("hasAnyRole('MECHANIC', 'ADMIN')")
    public void delete(@PathVariable Long id) { service.delete(id); }
}

