package com.codeandskills.billing_service.application.service;

import com.codeandskills.billing_service.domain.models.Payment;
import com.codeandskills.billing_service.domain.models.PaymentStatus;
import com.codeandskills.billing_service.domain.repository.PaymentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Optional<Payment> findByStripeId(String sessionId) {
        return paymentRepository.findByStripeId(sessionId);
    }

    // ✅ Paiement validé (checkout.session.completed)
    public Payment markAsPaid(String stripeSessionId, String userId, String courseId,
                               String paymentIntentId, String type) {

        Optional<Payment> savedPayment = paymentRepository.findByStripeId(stripeSessionId);
        if (!savedPayment.isPresent()) {
            throw new IllegalStateException("Payment not found for session: " + stripeSessionId);
        }
        savedPayment.get().setStatus(PaymentStatus.PAID);
        savedPayment.get().setStripePaymentIntentId(paymentIntentId);
        savedPayment.get().setMethod("card");
        savedPayment.get().setUpdatedAt(LocalDateTime.now());
        savedPayment.get().setReceiptUrl("https://dashboard.stripe.com/payments/"  + paymentIntentId);
        savedPayment.get().setType(type);

        paymentRepository.save(savedPayment.get());

        /* enrollmentRepository.findById(enrollmentId).ifPresent(enrollment -> {
            enrollment.setStatus("Active");
            enrollmentRepository.save(enrollment);
        }); */

        log.info("✅ Paiement validé et enrollment activé pour user={} / course={}", userId, courseId);
        return savedPayment.get();
    }

    // ✅ Paiement validé via payment_intent.succeeded
    public Payment markAsPaidByIntentId(String paymentIntentId) {
        return paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                .map(payment -> {
                    payment.setStatus(PaymentStatus.PAID);
                    payment.setUpdatedAt(LocalDateTime.now());
                    return paymentRepository.save(payment);
                })
                .orElse(null);
    }

    // ❌ Paiement échoué
    public void markAsFailedByIntentId(String paymentIntentId, String reason) {
        paymentRepository.findByStripePaymentIntentId(paymentIntentId).ifPresent(p -> {
            p.setStatus(PaymentStatus.FAILED);
            p.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(p);
            log.warn("❌ Paiement marqué comme échoué : {} ({})", p.getId(), reason);
        });
    }

    // 💸 Paiement remboursé (ex: via Stripe event `charge.refunded`)
    public void markAsRefunded(String paymentIntentId, String refundReason) {
        paymentRepository.findByStripePaymentIntentId(paymentIntentId).ifPresent(payment -> {
            payment.setStatus(PaymentStatus.REFUNDED);
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
            log.info("💸 Paiement remboursé : {} (raison={})", payment.getId(), refundReason);
        });
    }

    // 🚫 Paiement annulé (ex: session expirée, annulation avant validation)
    public void markAsCanceled(String stripeSessionId) {
        paymentRepository.findByStripeId(stripeSessionId).ifPresent(payment -> {
            payment.setStatus(PaymentStatus.CANCELED);
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
            log.info("🚫 Paiement annulé pour session : {}", stripeSessionId);
        });
    }
}
