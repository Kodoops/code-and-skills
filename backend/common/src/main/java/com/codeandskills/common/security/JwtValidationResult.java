package com.codeandskills.common.security;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class JwtValidationResult {
    private boolean valid;
    private String userId;
    private String username;
    private String email;
    private String role;
    private String sessionId;
    private Date expiresAt;
    private String error;

    public static JwtValidationResult invalid(String message) {
        return JwtValidationResult.builder()
                .valid(false)
                .error(message)
                .build();
    }

    public static JwtValidationResult valid(String userId, String email, String role, String sessionId, Date expiresAt) {
        return JwtValidationResult.builder()
                .valid(true)
                .userId(userId)
                .username(email)
                .email(email)
                .role(role)
                .sessionId(sessionId)
                .expiresAt(expiresAt)
                .build();
    }
}