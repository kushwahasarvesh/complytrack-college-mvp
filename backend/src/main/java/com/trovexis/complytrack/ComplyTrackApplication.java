package com.trovexis.complytrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

import java.util.TimeZone;

@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class ComplyTrackApplication {
    public static void main(String[] args) {
        // Windows still reports the legacy zone id Asia/Calcutta, which current PostgreSQL rejects.
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(ComplyTrackApplication.class, args);
    }
}
