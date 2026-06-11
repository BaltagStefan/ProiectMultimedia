package ro.autoassist.parts.service;

import java.util.List;

import org.springframework.stereotype.Service;

import ro.autoassist.parts.entity.Part;
import ro.autoassist.parts.repository.PartRepository;

@Service
public class PartService {
    private final PartRepository repository;

    public PartService(PartRepository repository) {
        this.repository = repository;
    }

    public List<Part> search(String query, Long zoneId) {
        return repository.search(blankToNull(query), zoneId);
    }

    public Part one(Long id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Piesa nu există."));
    }

    public Part save(Part part) {
        if (part.getName() == null || part.getPrice() == null) {
            throw new IllegalArgumentException("Numele și prețul sunt obligatorii.");
        }
        if (part.getStock() == null) part.setStock(0);
        return repository.save(part);
    }

    public Part update(Long id, Part input) {
        Part part = one(id);
        part.setName(input.getName());
        part.setCategoryId(input.getCategoryId());
        part.setZoneId(input.getZoneId());
        part.setCompatibleCarId(input.getCompatibleCarId());
        part.setDescription(input.getDescription());
        part.setPrice(input.getPrice());
        part.setStock(input.getStock());
        part.setImageMediaId(input.getImageMediaId());
        return save(part);
    }

    public void delete(Long id) { repository.delete(one(id)); }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}

