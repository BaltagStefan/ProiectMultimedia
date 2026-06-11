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
    public AppointmentDtos.View create(AppointmentDtos.Create input, String subject) {
        if (input.appointmentTime() == null) throw new IllegalArgumentException("Data este obligatorie.");
        return repository.create(input, subject);
    }

    public List<AppointmentDtos.View> all() { return repository.all(); }

    @Transactional
    public AppointmentDtos.View status(Long id, String status) {
        if (!STATUSES.contains(status)) throw new IllegalArgumentException("Status necunoscut.");
        return repository.updateStatus(id, status);
    }
}

