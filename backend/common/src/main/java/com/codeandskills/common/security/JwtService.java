package com.codeandskills.common.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;

@Slf4j
@Service
public class JwtService {

    private final String currentSecret;
    private final String previousSecret;
    private final long expirationMs;
    private final long refreshExpiration;

    private final Algorithm algorithm;
    private final JWTVerifier verifier;

    public JwtService(
            @Value("${jwt.secret.current}") String currentSecret,
            @Value("${jwt.secret.previous:}") String previousSecret,
            @Value("${jwt.expiration:3600000}") long expirationMs,
            @Value("${jwt.refresh.expiration:2592000000}") long refreshExpiration // 30 jours
    ) {
        this.currentSecret = currentSecret;
        this.previousSecret = previousSecret;
        this.expirationMs = expirationMs;
        this.refreshExpiration = refreshExpiration;

        this.algorithm = Algorithm.HMAC256(currentSecret);
        this.verifier = JWT.require(algorithm).build();
    }

    public String generateToken(String userId, String email, String role, String sessionId) {
        return JWT.create()
                .withSubject(email)
                .withClaim("userId", userId.toString())
                .withClaim("username", email)
                .withClaim("email", email)
                .withClaim("role", role)
                .withClaim("sessionId", sessionId)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationMs))
                .sign(algorithm);
    }

    public DecodedJWT verify(String token) {
        try {
            return verifier.verify(cleanToken(token));
        } catch (JWTVerificationException e) {
            if (previousSecret != null && !previousSecret.isBlank()) {
                try {
                    Algorithm previous = Algorithm.HMAC256(previousSecret);
                    JWTVerifier oldVerifier = JWT.require(previous).build();
                    return oldVerifier.verify(cleanToken(token));
                } catch (JWTVerificationException e2) {
                    log.warn("🚫 Token invalide après rotation : {}", e2.getMessage());
                    throw new RuntimeException("Invalid or expired token");
                }
            }
            throw new RuntimeException("Invalid or expired token");
        }
    }

    public Map<String, Object> extractClaims(String token) {
        DecodedJWT jwt = verify(token);
        return Map.of(
                "userId", jwt.getClaim("userId").asString(),
                "email", jwt.getClaim("email").asString(),
                "role", jwt.getClaim("role").asString(),
                "username", jwt.getClaim("username").asString(),
                "sessionId", jwt.getClaim("sessionId").asString()
        );
    }

    public String extractUserId(String token) {
        return verify(token).getClaim("userId").asString();
    }

    public String extractEmail(String token) {
        return verify(token).getClaim("email").asString();
    }

    public String extractRole(String token) {
        return verify(token).getClaim("role").asString();
    }

    public String extractUsername(String token) {
        return verify(token).getClaim("username").asString();
    }

    public String extractSessionId(String token) {
        return verify(token).getClaim("sessionId").asString();
    }


    public JwtValidationResult validateToken(String token) {
        if (token == null || token.isBlank()) {
            return JwtValidationResult.invalid("Token manquant ou vide");
        }

        try {
            DecodedJWT jwt = verify(token);
            return JwtValidationResult.builder()
                    .valid(true)
                    .userId(jwt.getClaim("userId").asString())
                    .email(jwt.getClaim("email").asString())
                    .username(jwt.getClaim("username").asString())
                    .role(jwt.getClaim("role").asString())
                    .sessionId(jwt.getClaim("sessionId").asString())
                    .expiresAt(jwt.getExpiresAt())
                    .build();
        } catch (RuntimeException e) {
            return JwtValidationResult.invalid(e.getMessage());
        }
    }

    private String cleanToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7).trim() : token.trim();
    }

    public long getRefreshExpiration() {
        return refreshExpiration;
    }

    public long getAccessExpiration() {
        return expirationMs;
    }

    public boolean isTokenValid(String token, String username) {
        try {
            DecodedJWT jwt = verify(token);
            String extractedEmail = jwt.getClaim("email").asString();
            Date expiresAt = jwt.getExpiresAt();

            return extractedEmail != null
                    && extractedEmail.equals(username)
                    && expiresAt.after(new Date());
        } catch (Exception e) {
            log.warn("❌ Token invalide : {}", e.getMessage());
            return false;
        }
    }
}