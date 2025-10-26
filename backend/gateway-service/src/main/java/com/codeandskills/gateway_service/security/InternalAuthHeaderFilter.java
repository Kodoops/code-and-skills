package com.codeandskills.gateway_service.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
public class InternalAuthHeaderFilter implements GlobalFilter, Ordered {

    @Value("${gateway.trust.secret}")
    private String gatewaySecret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // ✅ Injecter le secret UNIQUEMENT pour les routes internes
        if (path.startsWith("/internal/")) {
            exchange = exchange.mutate()
                    .request(r -> r.headers(h -> h.set("X-Gateway-Secret", gatewaySecret)))
                    .build();
            log.debug("🔐 Injected X-Gateway-Secret for path: {}", path);
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1; // très haut dans la chaîne
    }
}