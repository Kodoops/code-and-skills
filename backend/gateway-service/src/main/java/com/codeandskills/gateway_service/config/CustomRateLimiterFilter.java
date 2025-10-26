package com.codeandskills.gateway_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * 🔒 Filtre global de protection contre le brute-force et les abus.
 * Applique un rate limit différent selon l’endpoint sensible.
 */
@Component
public class CustomRateLimiterFilter implements GlobalFilter, Ordered {

    private final ReactiveStringRedisTemplate redisTemplate;

    // 🔧 Configuration des limites par endpoint (requis / TTL secondes)
    private static final Map<String, RateLimitConfig> RATE_LIMITS = Map.of(
            "/auth/login", new RateLimitConfig(5, 10),          // 5 req / 10s
            "/auth/register", new RateLimitConfig(5, 10),       // 5 req / 10s
            "/auth/forgot-password", new RateLimitConfig(3, 30),// 3 req / 30s
            "/auth/reset-password", new RateLimitConfig(3, 60)  // 3 req / 60s
    );

    @Autowired
    public CustomRateLimiterFilter(ReactiveStringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        String clientIp = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();

        // ✅ Vérifie si le path correspond à un endpoint sensible
        RateLimitConfig config = getRateLimitConfig(path);
        if (config == null) {
            return chain.filter(exchange); // pas de rate limit
        }

        String key = "ratelimit:" + clientIp + ":" + path;

        return redisTemplate.opsForValue().increment(key)
                .flatMap(count -> {
                    if (count == 1) {
                        // TTL dynamique selon endpoint
                        return redisTemplate.expire(key, Duration.ofSeconds(config.ttlSeconds()))
                                .thenReturn(count);
                    }
                    return Mono.just(count);
                })
                .flatMap(count -> {
                    if (count > config.maxRequests()) {
                        return tooManyRequestsResponse(exchange, path, config);
                    }
                    return chain.filter(exchange);
                });
    }

    private Mono<Void> tooManyRequestsResponse(ServerWebExchange exchange, String path, RateLimitConfig config) {
        var response = exchange.getResponse();
        response.setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String json = String.format("""
            {
              "path": "%s",
              "correlationId": "%s",
              "error": "Too Many Requests",
              "message": "Trop de tentatives sur cet endpoint. Réessayez dans %d secondes.",
              "timestamp": "%s",
              "status": 429
            }
            """,
                path,
                UUID.randomUUID(),
                config.ttlSeconds(),
                Instant.now()
        );

        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
    }

    private RateLimitConfig getRateLimitConfig(String path) {
        // match exact ou fin de path (ex: /api/auth/login → /auth/login)
        return RATE_LIMITS.entrySet().stream()
                .filter(entry -> path.endsWith(entry.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);
    }

    @Override
    public int getOrder() {
        // exécuter avant les filtres de sécurité JWT
        return -1;
    }

    /**
     * ✅ Petit record interne pour stocker la config (Java 17+)
     */
    private record RateLimitConfig(int maxRequests, int ttlSeconds) {}
}