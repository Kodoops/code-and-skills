package com.codeandskills.auth_service.domain.repository;

import com.codeandskills.auth_service.domain.model.AuthEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthEventRepository extends JpaRepository<AuthEvent, String> {
}
