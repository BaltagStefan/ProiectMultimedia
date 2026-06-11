package ro.autoassist.appointment.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ro.autoassist.appointment.dto.AppointmentDtos;
import ro.autoassist.appointment.repository.AppointmentRepository;

@Service
public class AppointmentService {
    private static final Set<String> STATUSES =
        Set.of("PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELED");
    private final AppointmentRepository repository;
    public AppointmentService(AppointmentRepository repository) { this.repository = repository; }

    @Transactional
    public AppointmentDtos.View create(AppointmentDtos.Create input, String subject, String username) {
        if (input.appointmentTime() == null || input.serviceId() == null) {
            throw new IllegalArgumentException("Service-ul și data sunt obligatorii.");
        }
        if (input.appointmentTime().isBefore(java.time.OffsetDateTime.now())) {
            throw new IllegalArgumentException("Programarea trebuie să fie în viitor.");
        }
        return repository.create(input, subject, username);
    }

    public List<AppointmentDtos.View> all() { return repository.all(); }
    public List<AppointmentDtos.View> mine(String subject) { return repository.mine(subject); }

    @Transactional
    public AppointmentDtos.View cancel(Long id, String subject) {
        return repository.cancelOwn(id, subject);
    }

    @Transactional
    public AppointmentDtos.View status(Long id, String status) {
        if (!STATUSES.contains(status)) throw new IllegalArgumentException("Status necunoscut.");
        return repository.updateStatus(id, status);
    }
}
