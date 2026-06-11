package ro.autoassist.parts.service;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import ro.autoassist.parts.entity.Part;
import ro.autoassist.parts.repository.PartRepository;

@Service
public class PartService {
    private final PartRepository repository;
    private final JdbcTemplate jdbc;

    public PartService(PartRepository repository, JdbcTemplate jdbc) {
        this.repository = repository;
        this.jdbc = jdbc;
    }

    public List<Part> search(String query, Long zoneId) {
        return repository.search(blankToNull(query), zoneId);
    }

    public Part one(Long id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Piesa nu există."));
    }

    public List<CategoryView> categories() {
        return jdbc.query("SELECT id, name FROM part_categories ORDER BY name",
            (rs, row) -> new CategoryView(rs.getLong("id"), rs.getString("name")));
    }

    public Part save(Part part) {
        if (part.getName() == null || part.getName().isBlank() || part.getPrice() == null) {
            throw new IllegalArgumentException("Numele și prețul sunt obligatorii.");
        }
        if (part.getCategoryId() == null || part.getZoneId() == null || part.getCompatibleCarId() == null) {
            throw new IllegalArgumentException("Categoria, zona și compatibilitatea sunt obligatorii.");
        }
        if (part.getPrice().signum() < 0) {
            throw new IllegalArgumentException("Prețul nu poate fi negativ.");
        }
        if (part.getStock() == null) part.setStock(0);
        if (part.getStock() < 0) {
            throw new IllegalArgumentException("Stocul nu poate fi negativ.");
        }
        part.setName(part.getName().trim());
        if (part.getDescription() != null) part.setDescription(part.getDescription().trim());
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

    public record CategoryView(Long id, String name) {}
}
