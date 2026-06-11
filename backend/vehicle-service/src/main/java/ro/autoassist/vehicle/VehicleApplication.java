package ro.autoassist.vehicle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"ro.autoassist.vehicle", "ro.autoassist.common"})
public class VehicleApplication {
    public static void main(String[] args) {
        SpringApplication.run(VehicleApplication.class, args);
    }
}

