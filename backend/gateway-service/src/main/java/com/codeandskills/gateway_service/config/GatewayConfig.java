package com.codeandskills.gateway_service.config;

import org.springframework.cloud.gateway.filter.factory.RequestRateLimiterGatewayFilterFactory;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder,
                                     RequestRateLimiterGatewayFilterFactory rateLimiter) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .filters(f -> f
                                .rewritePath("/api/(?<remaining>.*)", "/${remaining}")
                        )
                        .uri("lb://AUTH-SERVICE")
                )
                .build();
    }

    @Bean
    public RedisRateLimiter redisRateLimiter() {
        // refill 3 tokens/sec, burst 5
        return new RedisRateLimiter(3, 5);
    }

    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(
                exchange.getRequest()
                        .getRemoteAddress()
                        .getAddress()
                        .getHostAddress()
                        .replace("0:0:0:0:0:0:0:1", "127.0.0.1")
        );
    }
}