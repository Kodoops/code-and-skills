package com.codeandskills.billing_service.domain.repository;

import com.codeandskills.billing_service.domain.models.Invoice;
import com.codeandskills.billing_service.domain.models.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    Page<Invoice> findByTenantId(String tenantId, Pageable pageable);

    Page<Invoice> findByTenantIdAndStatus(String tenantId, InvoiceStatus status, Pageable pageable);

    Optional<Invoice> findByIdAndTenantId(String id, String userId);

    Optional<Invoice> findByPaymentIdAndTenantId(String paymentId, String userId);

    Optional<Invoice> findByPaymentId(String id);
}
