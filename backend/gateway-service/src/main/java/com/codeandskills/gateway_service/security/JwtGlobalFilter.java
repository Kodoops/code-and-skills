package com.codeandskills.gateway_service.security;

import com.codeandskills.common.security.JwtService;
import com.codeandskills.common.security.JwtValidationResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtGlobalFilter implements GlobalFilter {

    private final JwtService jwtService;
    private final SessionIntrospectionClient sessionClient;
    private final JwtProperties jwtProperties;

    @Value("${gateway.trust.secret:}")
    private String trustSecret;

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    private boolean matchesAny(String path) {
        if (jwtProperties.getPublicPaths() == null) return false;
        for (String p : jwtProperties.getPublicPaths()) {
            log.info("Checking path {} against public paths {}", path, p);
            if (pathMatcher.match(p.trim(), path)) {
                log.info(path + " is a public path and will be skipped");
                return true;
            }
        }
        return false;
    }

    private boolean isPublicPath(String rawPath) {
        String normalized = rawPath.startsWith("/api/") ? rawPath.substring(4) : rawPath;
        return matchesAny(rawPath) || matchesAny(normalized);
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        final String path = exchange.getRequest().getURI().getPath();

        // ✅ 1) Laisse passer les routes internes mais ajoute toujours la signature
        if (path.startsWith("/internal/")) {
            ServerWebExchange mutated = addGatewaySignature(exchange);
            return chain.filter(mutated);
        }


        // ✅ 2) Routes publiques : pas de JWT requis, mais on signe quand même
        if (isPublicPath(path)) {
            ServerWebExchange mutated = addGatewaySignature(exchange);
            return chain.filter(mutated);
        }

        // 🔑 3) Pour les autres routes : validation JWT + signature
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return writeJsonError(exchange, HttpStatus.UNAUTHORIZED, "Token manquant ou invalide");
        }
        String token = authHeader.substring(7);

        JwtValidationResult result = jwtService.validateToken(token);

        if (!result.isValid()) {
            return writeJsonError(exchange, HttpStatus.UNAUTHORIZED, result.getError());
        }

        String userId = result.getUserId();
        String email = result.getEmail();
        String role = result.getRole();
        String sessionId = result.getSessionId();

        if (sessionId == null || sessionId.isBlank()) {
            return writeJsonError(exchange, HttpStatus.UNAUTHORIZED, "Session invalide ou absente");
        }

        Mono<Boolean> check = sessionClient.isEnabled()
                ? sessionClient.isSessionActive(sessionId)
                .doOnError(err -> log.error("❌ Erreur lors de la vérification de session: {}", err.getMessage()))
                .onErrorReturn(false)
                : Mono.just(true);



        return check.flatMap(active -> {
            if (!active) {
                return writeJsonError(exchange, HttpStatus.UNAUTHORIZED, "Session invalide.");
            }


            // ✅ 4) Propager infos utilisateur + signature
            ServerWebExchange mutated = exchange.mutate()
                    .request(r -> r.headers(h -> {
                        if (userId != null) h.set("X-User-Id", userId);
                        if (email != null) h.set("X-User-Email", email);
                        if (role != null) h.set("X-User-Role", role);
                        h.set("X-Session-Id", sessionId);
                        h.set("X-Gateway-Signature", trustSecret);
                    }))
                    .build();


            return chain.filter(mutated);
        });
    }

    /** 🔏 Ajoute systématiquement la signature Gateway */
    private ServerWebExchange addGatewaySignature(ServerWebExchange exchange) {
        return exchange.mutate()
                .request(r -> r.headers(h -> h.set("X-Gateway-Signature", trustSecret)))
                .build();
    }

    private Mono<Void> writeJsonError(ServerWebExchange exchange, HttpStatus status, String message) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

        String body = String.format("""
        {
            "timestamp": "%s",
            "status": %d,
            "error": "%s",
            "message": "%s",
            "path": "%s"
        }
        """,
                java.time.Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                exchange.getRequest().getPath().value()
        );

        byte[] bytes = body.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        var buffer = exchange.getResponse().bufferFactory().wrap(bytes);
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }
}