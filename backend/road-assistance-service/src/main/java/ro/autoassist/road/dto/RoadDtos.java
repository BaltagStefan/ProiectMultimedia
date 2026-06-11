package ro.autoassist.road.dto;

import java.time.OffsetDateTime;

public final class RoadDtos {
    private RoadDtos() {}
    public record Create(Long assignedServiceId, Double latitude, Double longitude,
                         String problemDescription) {}
    public record View(Long id, Long assignedServiceId, String serviceName, Double latitude,
                       Double longitude, String problemDescription, String status,
                       OffsetDateTime createdAt) {}
    public record StatusUpdate(String status) {}
}

