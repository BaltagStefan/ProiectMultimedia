package ro.autoassist.locator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"ro.autoassist.locator", "ro.autoassist.common"})
public class ServiceLocatorApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServiceLocatorApplication.class, args);
    }
}

