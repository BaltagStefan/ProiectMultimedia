package ro.autoassist.parts.entity;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "parts")
public class Part {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(name = "category_id") private Long categoryId;
    @Column(name = "zone_id") private Long zoneId;
    @Column(name = "compatible_car_id") private Long compatibleCarId;
    private String description;
    private BigDecimal price;
    private Integer stock;
    @Column(name = "uploaded_by_mechanic_id") private Long uploadedByMechanicId;
    @Column(name = "image_media_id") private Long imageMediaId;
    @Column(name = "created_at") private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public Long getZoneId() { return zoneId; }
    public void setZoneId(Long zoneId) { this.zoneId = zoneId; }
    public Long getCompatibleCarId() { return compatibleCarId; }
    public void setCompatibleCarId(Long compatibleCarId) { this.compatibleCarId = compatibleCarId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Long getUploadedByMechanicId() { return uploadedByMechanicId; }
    public void setUploadedByMechanicId(Long value) { this.uploadedByMechanicId = value; }
    public Long getImageMediaId() { return imageMediaId; }
    public void setImageMediaId(Long imageMediaId) { this.imageMediaId = imageMediaId; }
    public Instant getCreatedAt() { return createdAt; }
}

