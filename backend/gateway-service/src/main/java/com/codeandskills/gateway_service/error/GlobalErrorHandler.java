package com.codeandskills.gateway_service.error;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@Order(-2)
public class GlobalErrorHandler implements ErrorWebExceptionHandler {

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        // 🧠 Cas 1 : erreur déjà gérée par un microservice (propagée depuis WebClient)
        if (ex instanceof WebClientResponseException wex) {
            log.warn("↩️ Passing through upstream error from service: {} - {}", wex.getRawStatusCode(), wex.getMessage());
            exchange.getResponse().setStatusCode(HttpStatusCode.valueOf(wex.getRawStatusCode()));
            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

            byte[] bytes = wex.getResponseBodyAsByteArray();
            DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
            return exchange.getResponse().writeWith(Mono.just(buffer));
        }

        // 🧠 Cas 2 : erreur d’API Gateway elle-même (ex: route inconnue)
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = "Unexpected gateway error";

        if (ex instanceof ResponseStatusException rse) {
            status = HttpStatus.resolve(rse.getStatusCode().value());
            if (status == null) status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = rse.getReason() != null ? rse.getReason() : status.getReasonPhrase();
        }

        String correlationId = exchange.getRequest().getHeaders().getFirst("X-Correlation-Id");
        if (correlationId == null) correlationId = UUID.randomUUID().toString();

        String path = exchange.getRequest().getURI().getPath();

        Map<String, Object> body = Map.of(
                "timestamp", Instant.now().toString(),
                "path", path,
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", message,
                "correlationId", correlationId
        );

        log.error("❌ Gateway internal error [{}]: {} ({} - {})", status.value(), message, path, correlationId, ex);

        byte[] bytes = toJson(body).getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);

        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        exchange.getResponse().setStatusCode(status);

        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    private String toJson(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder("{");
        map.forEach((k, v) -> {
            sb.append("\"").append(k).append("\":\"")
                    .append(v != null ? v.toString().replace("\"", "'") : "")
                    .append("\",");
        });
        if (sb.charAt(sb.length() - 1) == ',') sb.deleteCharAt(sb.length() - 1);
        sb.append("}");
        return sb.toString();
    }
}