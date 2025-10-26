package com.codeandskills.auth_service.infractructure.web.controller;

import com.codeandskills.auth_service.domain.model.UserSession;
import com.codeandskills.auth_service.domain.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/internal/sessions")
@RequiredArgsConstructor
public class InternalSessionController {

    @Value("${gateway.trust.secret:}")
    private String gatewaySecret;

    private final UserSessionRepository sessionRepo;

    @GetMapping("/{sessionId}")
    public ResponseEntity<UserSession> getSession(
            @RequestHeader("X-Gateway-Secret") String provided,
            @PathVariable(name = "sessionId") String sessionId
    ) {
        validateGatewaySecret(provided);
        return sessionRepo.findById(sessionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{sessionId}/status")
    public Map<String, Object> status(
            @RequestHeader(value = "X-Gateway-Secret", required = false) String provided,
            @PathVariable(name = "sessionId") String sessionId
    ) {

        validateGatewaySecret(provided);

        boolean active = sessionRepo.findById(sessionId)
                .filter(s -> !s.isRevoked() && s.getExpiresAt().isAfter(Instant.now()))
                .isPresent();

        log.info("🔐 Internal session check for {} → active={}", sessionId, active);

        return Map.of("active", active);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserSession>> getUserSessions(
            @RequestHeader("X-Gateway-Secret") String provided,
            @PathVariable(name = "userId") String userId
    ) {
        validateGatewaySecret(provided);
        List<UserSession> sessions = sessionRepo.findAllByUserIdAndRevokedFalse(userId);
        return ResponseEntity.ok(sessions);
    }

    // ✅ Méthode utilitaire pour valider la clé
    private void validateGatewaySecret( String provided) {

        if (provided == null || provided.isBlank() || !provided.equals(gatewaySecret)) {
            log.warn("🚫 Unauthorized internal API call: /internal/sessions/{} ",provided);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }
}