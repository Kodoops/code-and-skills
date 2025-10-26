package com.codeandskills.auth_service.application.service;

import com.codeandskills.auth_service.domain.model.AuthEvent;
import com.codeandskills.auth_service.domain.repository.AuthEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuditService {
    private final AuthEventRepository repository;

    public void log(String email, String action, String ip) {
        repository.save(AuthEvent.builder()
                .userEmail(email)
                .action(action)
                .ip(ip)
                .timestamp(Instant.now())
                .build());
    }
}