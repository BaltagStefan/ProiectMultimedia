package ro.autoassist.appointment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"ro.autoassist.appointment", "ro.autoassist.common"})
public class AppointmentApplication {
    public static void main(String[] args) {
        SpringApplication.run(AppointmentApplication.class, args);
    }
}

