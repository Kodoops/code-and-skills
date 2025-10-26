package com.codeandskills.gateway_service.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class SessionIntrospectionClient {

    private final WebClient webClient;
    private final String statusUrl;
    private final String trustSecret;
    private final boolean enabled;

    public SessionIntrospectionClient(
            WebClient.Builder builder,
            @Value("${gateway.session.status-url}") String statusUrl,
            @Value("${gateway.trust.secret:}") String trustSecret
    ) {
        this.webClient = builder.build();
        this.statusUrl = statusUrl;
        this.trustSecret = trustSecret;
        this.enabled = (trustSecret != null && !trustSecret.isBlank());
    }

    public boolean isEnabled() {
        return enabled;
    }

    public Mono<Boolean> isSessionActive(String sessionId) {
        if (!enabled) return Mono.just(true);

        return webClient.get()
                .uri(statusUrl, sessionId)
                .header("X-Gateway-Secret", trustSecret)
                .retrieve()
                .bodyToMono(SessionStatus.class)
                .map(SessionStatus::active)
                .doOnNext(active -> log.info("✅ Session {} active={}", sessionId, active))
                .onErrorResume(ex -> {
                    log.error("❌ Error while calling Auth session check: {}", ex.getMessage());
                    return Mono.just(false);
                });
    }

    private record SessionStatus(boolean active) {}
}