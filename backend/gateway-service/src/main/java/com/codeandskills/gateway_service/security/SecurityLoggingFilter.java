package com.codeandskills.gateway_service.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class SecurityLoggingFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long start = System.currentTimeMillis();

        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethod() != null ? exchange.getRequest().getMethod().name() : "UNKNOWN";
        String ip = exchange.getRequest().getRemoteAddress() != null
                ? exchange.getRequest().getRemoteAddress().getHostString()
                : "unknown";
        String correlationId = exchange.getRequest().getHeaders().getFirst("X-Correlation-Id");

        return chain.filter(exchange)
                .doFinally(signalType -> {
                    long duration = System.currentTimeMillis() - start;
                    HttpStatusCode statusCode = exchange.getResponse().getStatusCode();

                    // ✅ Convertit proprement HttpStatusCode → HttpStatus si possible
                    int code = statusCode != null ? statusCode.value() : 0;
                    String reason = (statusCode instanceof HttpStatus)
                            ? ((HttpStatus) statusCode).getReasonPhrase()
                            : "Unknown";

                    log.info("🔐 [SECURITY] [{}] {} → {} {} | ip={} | duration={}ms | correlationId={}",
                            method,
                            path,
                            code,
                            reason,
                            ip,
                            duration,
                            correlationId);
                });
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}