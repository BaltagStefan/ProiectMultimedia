package ro.autoassist.common.security;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .requestMatchers("/api/services/**", "/api/parts/**", "/api/car-brands/**",
                    "/api/car-models/**", "/api/vehicle-zones/**").permitAll()
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth -> oauth
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
            .build();
    }

    private Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter() {
        return jwt -> new JwtAuthenticationToken(jwt, realmRoles(jwt), jwt.getClaimAsString("preferred_username"));
    }

    @SuppressWarnings("unchecked")
    private Collection<GrantedAuthority> realmRoles(Jwt jwt) {
        Map<String, Object> access = Optional
            .ofNullable(jwt.getClaimAsMap("realm_access"))
            .orElse(Map.of());
        List<String> roles = (List<String>) access.getOrDefault("roles", List.of());
        return roles.stream()
            .map(role -> (GrantedAuthority) new SimpleGrantedAuthority("ROLE_" + role))
            .toList();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost", "http://localhost:*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

