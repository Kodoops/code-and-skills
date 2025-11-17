package com.codeandskills.notification_service.domain.repository;

import com.codeandskills.notification_service.domain.model.Newsletter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NewsletterRepository extends JpaRepository<Newsletter, String> {
    Optional<Newsletter> findByEmail(String email);

    Page<Newsletter> findByConfirmedIsTrue(Pageable pageable);
    Page<Newsletter> findByConfirmedIsFalse(Pageable pageable);
}
