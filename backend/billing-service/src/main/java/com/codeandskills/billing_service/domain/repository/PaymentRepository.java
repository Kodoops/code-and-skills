package com.codeandskills.billing_service.domain.repository;

import com.codeandskills.billing_service.application.dto.PaymentStatusTotalProjection;
import com.codeandskills.billing_service.domain.models.InvoiceItemType;
import com.codeandskills.billing_service.domain.models.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByStripeId(String stripeSessionId);

    Optional<Payment> findByStripePaymentIntentId(String paymentIntentId);

    Page<Payment> findAll(Specification<Payment> spec, Pageable pageable);

    @Query("""
        SELECT p.status AS status, SUM(p.amount) AS total
        FROM Payment p
        WHERE (:userId IS NULL OR :userId = '' OR p.userId = :userId)
          AND (:type IS NULL OR p.type = :type)
        GROUP BY p.status
        """)
    List<PaymentStatusTotalProjection> sumAmountByStatus(
            @Param("userId") String userId,
            @Param("type") InvoiceItemType type
    );
}