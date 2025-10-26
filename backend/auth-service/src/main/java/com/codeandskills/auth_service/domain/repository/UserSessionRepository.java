package com.codeandskills.auth_service.domain.repository;

import com.codeandskills.auth_service.domain.model.User;
import com.codeandskills.auth_service.domain.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession, String> {
    Optional<UserSession> findByRefreshToken(String refreshToken);
    List<UserSession> findAllByUserAndRevokedFalse(User user);

    List<UserSession> findAllByUserIdAndRevokedFalse(String userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserSession s WHERE s.expiresAt < :now OR (s.revoked = true AND s.expiresAt < :threshold)")
    void deleteExpiredAndRevokedBefore(@Param("now") Instant now, @Param("threshold") Instant threshold);

    void deleteAllByUserId(String userId);
}
