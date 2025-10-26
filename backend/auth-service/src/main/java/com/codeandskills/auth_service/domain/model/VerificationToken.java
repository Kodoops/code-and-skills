package com.codeandskills.auth_service.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "verification_tokens")
public class VerificationToken extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationTokenType type; // ✅ Vérif compte ou reset password

    @Column(nullable = false)
    private Instant expiresAt;

    private boolean used;

    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }

    public static VerificationToken generate(User user) {
        return VerificationToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .type(VerificationTokenType.ACCOUNT_VERIFICATION)
                .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))// 24h
                .used(false)
                .build();
    }
}
