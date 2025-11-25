package com.codeandskills.billing_service.application.service;

import com.codeandskills.billing_service.domain.models.*;
import com.codeandskills.billing_service.domain.repository.EnrollmentRepository;
import com.codeandskills.billing_service.domain.repository.PaymentRepository;
import com.codeandskills.billing_service.infrastructure.dto.CheckoutResponse;
import com.codeandskills.billing_service.infrastructure.dto.CourseCheckoutRequest;
import com.codeandskills.billing_service.infrastructure.web.dto.BillingStatsResponse;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillingService {

    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Value("${app.frontendUrl}") private String frontendUrl;

    public CheckoutResponse createCourseCheckout(CourseCheckoutRequest req) throws Exception {

        log.info("🧾 Création session Stripe pour user={}, course={}, amount={} {}",
                req.getUserId(), req.getCourseId(), req.getAmount(), req.getCurrency());

        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/payment/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/payment/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(req.getCurrency())
                                                .setUnitAmount(req.getAmount().longValue())
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Course " + req.getCourseId())
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .putMetadata("userId", req.getUserId())
                .putMetadata("courseId", req.getCourseId())
                .putMetadata("type", "COURSE");

        // ⚙️ GESTION conditionnelle Stripe Customer
        if (req.getStripeCustomerId() != null && !req.getStripeCustomerId().isBlank()) {
            log.info("✅ Utilisation du client Stripe existant : {}", req.getStripeCustomerId());
            builder.setCustomer(req.getStripeCustomerId());
        } else {
            log.info("📧 Pas de Stripe Customer ID → utilisation de l’email {}", req.getEmail());
            builder.setCustomerEmail(req.getEmail());
        }

        // ✅ Création de la session Stripe Checkout
        SessionCreateParams params = builder.build();
        Session session = Session.create(params);

        log.info("💳 Session Stripe créée avec ID={} et URL={}", session.getId(), session.getUrl());

        // 💾 Enregistre le paiement en attente
        Payment payment = Payment.builder()
                .userId(req.getUserId())
                .referenceId(req.getCourseId())
                .type(InvoiceItemType.COURSE)
                .stripeId(session.getId())
                .amount(BigDecimal.valueOf(req.getAmount()))
                .currency(req.getCurrency())
                .status(PaymentStatus.PENDING)
                .build();

        paymentRepository.save(payment);

        log.info("🧾 Paiement enregistré en base avec statut PENDING pour user={}", req.getUserId());

        // 🔹 Création de l'enrollment associé
        Enrollment enrollment = Enrollment.builder()
                .userId(req.getUserId())
                .referenceId(req.getCourseId())
                .type(EnrollmentType.valueOf(InvoiceItemType.COURSE.name().toUpperCase()))
                .amount(req.getAmount())
                .status(EnrollmentStatus.PENDING)
                .payment(payment)
                .build();

        enrollmentRepository.save(enrollment);

        log.info("🎓 Enrollment créé pour user={} et course={}", req.getUserId(), req.getCourseId());

        return new CheckoutResponse(session.getUrl(), payment.getId());
    }

    public long getBillingStats() {

        return enrollmentRepository.countClientsWithEnrollments();
    }
}