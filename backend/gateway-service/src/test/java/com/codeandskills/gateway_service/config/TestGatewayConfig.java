package com.codeandskills.gateway_service.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestGatewayConfig {

    @Bean
    public RouteLocator testRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/auth/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("http://localhost:8081")) // ✅ direct sans loadbalancer
                .build();
    }
}