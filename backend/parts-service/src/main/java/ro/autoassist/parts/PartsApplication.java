package ro.autoassist.parts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"ro.autoassist.parts", "ro.autoassist.common"})
public class PartsApplication {
    public static void main(String[] args) {
        SpringApplication.run(PartsApplication.class, args);
    }
}

