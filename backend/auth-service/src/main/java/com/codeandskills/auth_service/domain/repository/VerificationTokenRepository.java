package com.codeandskills.auth_service.domain.repository;

import com.codeandskills.auth_service.domain.model.User;
import com.codeandskills.auth_service.domain.model.VerificationToken;
import com.codeandskills.auth_service.domain.model.VerificationTokenType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, String> {
    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByTokenAndType(String token, VerificationTokenType type);

    void deleteByUser(User user);
}