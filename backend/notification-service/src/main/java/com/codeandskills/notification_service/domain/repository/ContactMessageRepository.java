package com.codeandskills.notification_service.domain.repository;

import com.codeandskills.notification_service.domain.model.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, String> {
    List<ContactMessage> findByStatus(String status);

    Page<ContactMessage> findByStatus(String status, Pageable pageable);

    Page<ContactMessage> findByUserId(String userId, Pageable pageable);

    Page<ContactMessage> findByStatusAndUserId(String status, String userId, Pageable pageable);

    Optional<ContactMessage> findByIdAndUserId(String id, String userId);
}