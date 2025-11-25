package com.codeandskills.billing_service.application.service;

import com.codeandskills.billing_service.application.dto.PaymentDTO;
import com.codeandskills.billing_service.application.dto.PaymentStatusTotalProjection;
import com.codeandskills.billing_service.application.mapper.PaymentMapper;
import com.codeandskills.billing_service.domain.models.*;
import com.codeandskills.billing_service.domain.repository.InvoiceRepository;
import com.codeandskills.billing_service.domain.repository.PaymentRepository;
import com.codeandskills.billing_service.infrastructure.dto.AdminSalesResponse;
import com.codeandskills.common.response.PagedResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final InvoiceRepository invoiceRepository;

    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper, InvoiceRepository invoiceRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.invoiceRepository = invoiceRepository;
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
        savedPayment.get().setType(InvoiceItemType.valueOf(type.toUpperCase()));

        paymentRepository.save(savedPayment.get());

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
    public Payment markAsFailedByIntentId(String paymentIntentId, String reason) {
      return   paymentRepository.findByStripePaymentIntentId(paymentIntentId)
              .map(payment -> {
                  payment.setStatus(PaymentStatus.FAILED);
                  payment.setUpdatedAt(LocalDateTime.now());

                  log.warn("❌ Paiement marqué comme échoué : {} ({})", payment.getId(), reason);
                  return paymentRepository.save(payment);
              })
              .orElse(null);
    }

    // 💸 Paiement remboursé (ex: via Stripe event `charge.refunded`)
    public Payment markAsRefunded(String paymentIntentId, String refundReason) {
       return paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                .map(payment -> {
                    payment.setStatus(PaymentStatus.REFUNDED);
                    payment.setUpdatedAt(LocalDateTime.now());
                    log.info("💸 Paiement remboursé : {} (raison={})", payment.getId(), refundReason);
                   return paymentRepository.save(payment);
                })
               .orElse(null);
    }

    // 🚫 Paiement annulé (ex: session expirée, annulation avant validation)
    public Payment markAsCanceled(String stripeSessionId) {
       return paymentRepository.findByStripeId(stripeSessionId)
               .map(payment -> {
                   payment.setStatus(PaymentStatus.CANCELED);
                   payment.setUpdatedAt(LocalDateTime.now());
                   log.info("🚫 Paiement annulé pour session : {}", stripeSessionId);
                   return paymentRepository.save(payment);
               })
               .orElse(null);
    }

    public PagedResponse<PaymentDTO> getPayments(
            String userId,
            String status,
            String type,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Specification<Payment> spec = Specification.where(null);

        // Filtre sur userId
        if (StringUtils.hasText(userId)) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("userId"), userId)
            );
        }

        // Filtre sur status (PAID, PENDING, FAILED...)
        if (StringUtils.hasText(status)) {
            try {
                PaymentStatus paymentStatus =
                        PaymentStatus.valueOf(status.toUpperCase(Locale.ROOT));

                spec = spec.and((root, query, cb) ->
                        cb.equal(root.get("status"), paymentStatus)
                );
            } catch (IllegalArgumentException e) {
                // status invalide → condition impossible
                spec = spec.and((root, query, cb) -> cb.equal(cb.literal(1), 0));
            }
        }

        // Filtre sur type (COURSE, SUBSCRIPTION...)
        if (StringUtils.hasText(type)) {
            try {
                InvoiceItemType invoiceItemType =
                        InvoiceItemType.valueOf(type.toUpperCase(Locale.ROOT));

                spec = spec.and((root, query, cb) ->
                        cb.equal(root.get("type"), invoiceItemType)
                );
            } catch (IllegalArgumentException e) {
                // type invalide → condition impossible
                spec = spec.and((root, query, cb) -> cb.equal(cb.literal(1), 0));
            }
        }

        Page<Payment> paymentPage = paymentRepository.findAll(spec, pageable);

        // Mapping entities -> DTOs
        var content = paymentPage.getContent()
                .stream()
                .map(paymentMapper::toDto)
                .toList();

        return new PagedResponse<>(
                content,
                paymentPage.getNumber(),
                paymentPage.getTotalPages(),
                paymentPage.getSize(),
                paymentPage.getTotalElements()
        );
    }

    public PaymentDTO getPaymentById(String id) {
        Optional<Payment> byId = paymentRepository.findById(id);
        if (byId.isPresent()) {
            Payment payment = byId.get();
            return paymentMapper.toDto(payment);
        }

        throw new IllegalArgumentException("Payment not found ");
    }

    @Transactional
    public PaymentDTO refundPayment(String paymentId) {
        // 1) Récupérer le payment
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with id: " + paymentId));

        if (payment.getStripePaymentIntentId() == null) {
            throw new IllegalStateException("No Stripe payment intent associated with this payment.");
        }

        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new IllegalStateException("Payment is already refunded.");
        }

        if (payment.getStatus() == PaymentStatus.FAILED) {
            throw new IllegalStateException("Cannot refund a failed payment.");
        }

        try {
            // 2) Récupérer le PaymentIntent Stripe
            PaymentIntent paymentIntent = PaymentIntent.retrieve(payment.getStripePaymentIntentId());

            if (!"succeeded".equals(paymentIntent.getStatus())) {
                throw new IllegalStateException(
                        "Only succeeded payments can be refunded. Current status: " + paymentIntent.getStatus()
                );
            }

            // 3) Créer le remboursement (complet)
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(paymentIntent.getId())
                    .build();

            Refund refund = Refund.create(params);

            // (Optionnel) logguer ou stocker l'id du refund
            log.info("Stripe refund created: {}", refund.getId());

            // 4) Mettre à jour le statut métier
            payment.setStatus(PaymentStatus.REFUNDED);
            payment.setUpdatedAt(LocalDateTime.now());
            payment.setStripeRefundId(refund.getId());

            paymentRepository.save(payment);

            // update Invoide with REFUNDED status
            Invoice invoice = invoiceRepository.findByPaymentId(payment.getId())
                    .orElseThrow(() -> new IllegalStateException("No invoice found for payment "));
            invoice.setStatus(InvoiceStatus.REFUNDED);
            invoiceRepository.save(invoice);

            // 5) Retourner le DTO
            return paymentMapper.toDto(payment);

        } catch (StripeException e) {
            throw new RuntimeException("Stripe refund error: " + e.getMessage(), e);
        }
    }

    public AdminSalesResponse getStatsPayments() {

        // 1) Récup liste paginée
        List<Payment> paymentPage = paymentRepository.findAll();

        List<PaymentDTO> content = paymentPage
                .stream()
                .map(paymentMapper::toDto)
                .toList();


        // 2) Récup stats par status (avec les mêmes filtres userId + type, mais SANS filtrer par status)
        List<PaymentStatusTotalProjection> projections =
                paymentRepository.sumAmountByStatus(
                        null,
                        null
                );

        Map<PaymentStatus, BigDecimal> totalsMap = new EnumMap<>(PaymentStatus.class);
        for (PaymentStatusTotalProjection proj : projections) {
            totalsMap.put(proj.getStatus(), proj.getTotal());
        }

        BigDecimal zero = BigDecimal.ZERO;

        BigDecimal totalPaid = totalsMap.getOrDefault(PaymentStatus.PAID, zero);
        BigDecimal totalPending = totalsMap.getOrDefault(PaymentStatus.PENDING, zero);
        BigDecimal totalFailed = totalsMap.getOrDefault(PaymentStatus.FAILED, zero);
        BigDecimal totalRefunded = totalsMap.getOrDefault(PaymentStatus.REFUNDED, zero);

        BigDecimal grandTotal = totalPaid
                .add(totalPending)
                .add(totalFailed)
                .add(totalRefunded);

        return AdminSalesResponse.builder()
                .totalPaid(totalPaid)
                .totalPending(totalPending)
                .totalFailed(totalFailed)
                .totalRefunded(totalRefunded)
                .grandTotal(grandTotal)
                .build();
    }
}
