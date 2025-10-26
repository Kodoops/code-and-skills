package com.codeandskills.auth_service.application.service;

import com.codeandskills.auth_service.domain.model.UserSession;
import com.codeandskills.auth_service.domain.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionCleanupService {

    private final UserSessionRepository sessionRepository;

    /**
     * Nettoie les sessions expirées ou révoquées depuis plus de 7 jours.
     * Exécuté chaque nuit à 02h00.
     */
//    @Scheduled(cron = "0 0 2 * * *") // Tous les jours à 2h du matin
//    public void cleanExpiredSessions() {
//        Instant now = Instant.now();
//        Instant revokedThreshold = now.minusSeconds(7 * 24 * 60 * 60); // 7 jours
//
//        List<UserSession> sessions = sessionRepository.findAll();
//
//        long beforeCount = sessions.size();
//
//        List<UserSession> expired = sessions.stream()
//                .filter(s -> s.getExpiresAt().isBefore(now) ||
//                        (s.isRevoked() && s.getExpiresAt().isBefore(revokedThreshold)))
//                .toList();
//
//        if (!expired.isEmpty()) {
//            sessionRepository.deleteAll(expired);
//            log.info("🧹 Nettoyage : {} sessions supprimées (expirées ou anciennes révoquées)", expired.size());
//        } else {
//            log.info("✅ Aucun nettoyage nécessaire ({} sessions actives)", beforeCount);
//        }
//    }

    @Scheduled(cron = "0 0 2 * * *")
    public void cleanExpiredSessions() {
        Instant now = Instant.now();
        Instant threshold = now.minusSeconds(7 * 24 * 60 * 60);
        sessionRepository.deleteExpiredAndRevokedBefore(now, threshold);
        log.info("🧹 Sessions expirées / révoquées nettoyées à {}", now);
    }
}