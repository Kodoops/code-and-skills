package com.codeandskills.billing_service.domain.repository;

import com.codeandskills.billing_service.domain.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByStripeId(String stripeSessionId);

    Optional<Payment> findByStripePaymentIntentId(String paymentIntentId);
}