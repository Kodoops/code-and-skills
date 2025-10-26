package com.codeandskills.gateway_service.web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebExceptionHandler;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.UUID;

@Configuration
public class RateLimiterExceptionHandler {

    @Bean
    public WebExceptionHandler rateLimiterHandler() {
        return (ServerWebExchange exchange, Throwable ex) -> {

            // ✅ Capture toute erreur avec statut HTTP 429
            if (ex instanceof ResponseStatusException statusEx
                    && statusEx.getStatusCode().value() == 429) {

                ServerHttpResponse response = exchange.getResponse();
                response.setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

                String path = exchange.getRequest().getURI().getPath();
                String correlationId = UUID.randomUUID().toString();

                String json = String.format("""
                    {
                      "path": "%s",
                      "correlationId": "%s",
                      "error": "Too Many Requests",
                      "message": "Trop de tentatives sur cet endpoint. Réessayez plus tard.",
                      "timestamp": "%s",
                      "status": %d
                    }
                    """, path, correlationId, Instant.now(), HttpStatus.TOO_MANY_REQUESTS.value());

                return response.writeWith(Mono.just(response.bufferFactory().wrap(json.getBytes())));
            }

            return Mono.error(ex);
        };
    }
}