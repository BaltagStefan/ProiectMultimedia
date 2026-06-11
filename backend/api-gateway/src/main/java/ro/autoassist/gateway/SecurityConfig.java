package ro.autoassist.gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchange -> exchange
                .pathMatchers("/actuator/health", "/api/services/**", "/api/parts/**",
                    "/api/car-brands/**", "/api/car-models/**", "/api/vehicle-zones/**").permitAll()
                .anyExchange().authenticated())
            .oauth2ResourceServer(resource -> resource.jwt(jwt -> {}))
            .build();
    }
}

