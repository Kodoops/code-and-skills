package com.codeandskills.billing_service.infrastructure.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextHolderFilter;

@Configuration
public class SecurityConfig {

    private final GatewayAuthenticationFilter gatewayAuthenticationFilter;
    private final GatewaySignatureFilter gatewaySignatureFilter;
    private final SecurityDebugFilter securityDebugFilter;

    public SecurityConfig(GatewayAuthenticationFilter gatewayAuthenticationFilter, GatewaySignatureFilter gatewaySignatureFilter, SecurityDebugFilter securityDebugFilter) {
        this.gatewayAuthenticationFilter = gatewayAuthenticationFilter;
        this.gatewaySignatureFilter = gatewaySignatureFilter;
        this.securityDebugFilter = securityDebugFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(gatewaySignatureFilter, SecurityContextHolderFilter.class)
                .addFilterBefore(gatewayAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(securityDebugFilter, GatewayAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers("/billing/invoices/user/**").authenticated()
                                .requestMatchers("/billing/enrollments/user/**").authenticated()
                                .requestMatchers("/billing/webhook/**").permitAll()
                                .requestMatchers("/billing/checkout/**").permitAll()
                                .requestMatchers("/billing/customers/ensure").permitAll()
//                        .requestMatchers("/billing/me/**").authenticated()
//                        .requestMatchers("/billing/premium/**").hasAnyRole("PREMIUM", "ADMIN")
//                        .requestMatchers("/billing/instructor/**").hasAnyRole("ADMIN", "INSTRUCTOR")
                                .requestMatchers("/billing/admin/**").hasRole("ADMIN")
                                .requestMatchers("/actuator/**").hasRole("ADMIN")
                                .anyRequest().denyAll()
                )
                .httpBasic(Customizer.withDefaults())
                .build();
    }
}