package ro.autoassist.profile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"ro.autoassist.profile", "ro.autoassist.common"})
public class AuthProfileApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthProfileApplication.class, args);
    }
}

