package com.codeandskills.auth_service.application.service;

import com.codeandskills.auth_service.domain.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionCleanupService {

    private final UserSessionRepository sessionRepository;


    @Scheduled(cron = "0 0 2 * * *")
    public void cleanExpiredSessions() {
        Instant now = Instant.now();
        Instant threshold = now.minusSeconds(7 * 24 * 60 * 60);
        sessionRepository.deleteExpiredAndRevokedBefore(now, threshold);
        log.info("🧹 Sessions expirées / révoquées nettoyées à {}", now);
    }
}