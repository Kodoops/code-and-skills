package com.codeandskills.notification_service.infrastructure.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final GatewayAuthenticationFilter gatewayAuthenticationFilter;

    public SecurityConfig(GatewayAuthenticationFilter gatewayAuthenticationFilter) {
        this.gatewayAuthenticationFilter = gatewayAuthenticationFilter;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(gatewayAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/notifications/newsletter/subscribe").permitAll()
                        .requestMatchers("/notifications/newsletter/confirm").permitAll()
                        .requestMatchers("/notifications/contact").permitAll()
                        .requestMatchers("/notifications/contact/user/**").authenticated()
                        .requestMatchers("/notifications/newsletter/user/**").authenticated()
                        .requestMatchers("/notifications/contact/admin/**").hasRole("ADMIN")
                        .requestMatchers("/notifications/newsletter/admin/**").hasRole("ADMIN")

                        .requestMatchers("/notifications/premium/**").hasAnyRole("PREMIUM", "ADMIN")
                        .requestMatchers("/notifications/instructor/**").hasAnyRole("ADMIN", "INSTRUCTOR")
                        .requestMatchers("/notifications/admin/**").hasRole("ADMIN")
                        .requestMatchers("/actuator/**").hasRole("ADMIN")
                        .anyRequest().denyAll()
                )
                .httpBasic(Customizer.withDefaults())
                .build();
    }
}