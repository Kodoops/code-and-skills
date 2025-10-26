package com.codeandskills.gateway_service.error;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Map;

@Slf4j
@Component
public class GatewayFallbackFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange)
                .onErrorResume(ex -> {
                    String path = exchange.getRequest().getPath().value();
                    log.error("❌ Service unavailable for path {}: {}", path, ex.getMessage());

                    String serviceName = resolveServiceName(path);

                    HttpStatus status = HttpStatus.SERVICE_UNAVAILABLE;
                    String message = serviceName + " is temporarily unavailable or not responding";

                    Map<String, Object> body = Map.of(
                            "timestamp", Instant.now().toString(),
                            "path", path,
                            "error", "Service Unavailable",
                           // "message", "A downstream service is unavailable or timed out",
                            "message", serviceName + " is temporarily unavailable",
                            "status", status.value()
                    );

                    byte[] bytes = toJson(body).getBytes(StandardCharsets.UTF_8);
                    exchange.getResponse().setStatusCode(status);
                    exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
                    exchange.getResponse().getHeaders().setContentLength(bytes.length);

                    return exchange.getResponse().writeWith(
                            Mono.just(exchange.getResponse().bufferFactory().wrap(bytes))
                    );
                });
    }

    /**
     * Détermine le microservice d'après le chemin appelé.
     */
    private String resolveServiceName(String path) {
        if (path.startsWith("/api/auth") || path.startsWith("/auth")) {
            return "Authentication Service";
        } else if (path.startsWith("/api/catalog") || path.startsWith("/catalog")) {
            return "Catalog Service";
        } else if (path.startsWith("/api/profiles") || path.startsWith("/profiles")) {
            return "User Profile Service";
        } else if (path.startsWith("/api/tenant") || path.startsWith("/tenant")) {
            return "Tenant Service";
        } else if (path.startsWith("/api/subscription") || path.startsWith("/subscription")) {
            return "Subscription Service";
        } else {
            return "Target Service";
        }
    }

    /**
     * Conversion simple d’une Map en JSON sans dépendance externe.
     */
    private String toJson(Map<String, Object> body) {
        StringBuilder sb = new StringBuilder("{");
        body.forEach((k, v) -> sb.append("\"").append(k).append("\":\"").append(v).append("\","));
        if (sb.charAt(sb.length() - 1) == ',') sb.deleteCharAt(sb.length() - 1);
        sb.append("}");
        return sb.toString();
    }

    @Override
    public int getOrder() {
        return -2; // avant le GlobalErrorHandler
    }
}
