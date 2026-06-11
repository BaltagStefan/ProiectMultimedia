package ro.autoassist.appointment.dto;

import java.time.OffsetDateTime;

public final class AppointmentDtos {
    private AppointmentDtos() {}
    public record Create(Long serviceId, Long carId, Long partId, OffsetDateTime appointmentTime,
                         String description) {}
    public record View(Long id, Long serviceId, String serviceName, Long carId, Long partId,
                       OffsetDateTime appointmentTime, String status, String description) {}
    public record StatusUpdate(String status) {}
}

