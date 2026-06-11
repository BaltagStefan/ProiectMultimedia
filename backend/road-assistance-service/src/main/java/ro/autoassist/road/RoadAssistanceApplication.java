package ro.autoassist.road;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"ro.autoassist.road", "ro.autoassist.common"})
public class RoadAssistanceApplication {
    public static void main(String[] args) {
        SpringApplication.run(RoadAssistanceApplication.class, args);
    }
}

