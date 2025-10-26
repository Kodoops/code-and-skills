package com.codeandskills.billing_service.domain.repository;

import com.codeandskills.billing_service.domain.models.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, String> {
}
