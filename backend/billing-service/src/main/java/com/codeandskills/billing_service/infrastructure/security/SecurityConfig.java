package com.codeandskills.billing_service.infrastructure.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

//    private final GatewayAuthenticationFilter gatewayAuthenticationFilter;
//
//    public SecurityConfig(GatewayAuthenticationFilter gatewayAuthenticationFilter) {
//        this.gatewayAuthenticationFilter = gatewayAuthenticationFilter;
//    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
               // .addFilterBefore(gatewayAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/billing/customers/ensure").permitAll() // <-- autorisé sans auth
//                        .requestMatchers("/billing/webhook/**").permitAll()        // <-- Stripe webhook public
//                        .requestMatchers("/billing/me/**").authenticated()
//                        .requestMatchers("/billing/premium/**").hasAnyRole("PREMIUM", "ADMIN")
//                        .requestMatchers("/billing/instructor/**").hasAnyRole("ADMIN", "INSTRUCTOR")
//                        .requestMatchers("/billing/admin/**").hasRole("ADMIN")
//                        .requestMatchers("/actuator/**").hasRole("ADMIN")
//                        .anyRequest().denyAll()
                                .anyRequest().permitAll()
                )
                .httpBasic(Customizer.withDefaults())
                .build();
    }
}