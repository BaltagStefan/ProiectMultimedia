package ro.autoassist.media;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"ro.autoassist.media", "ro.autoassist.common"})
public class MediaApplication {
    public static void main(String[] args) {
        SpringApplication.run(MediaApplication.class, args);
    }
}

