package com.codeandskills.billing_service.application.service;

import com.codeandskills.billing_service.application.dto.UserProfileDTO;
import com.codeandskills.billing_service.domain.models.Enrollment;
import com.codeandskills.billing_service.domain.models.EnrollmentStatus;
import com.codeandskills.billing_service.domain.models.Invoice;
import com.codeandskills.billing_service.domain.models.Payment;
import com.codeandskills.billing_service.infrastructure.client.GetPublicUserProfile;
import com.codeandskills.billing_service.infrastructure.client.UserProfileClient;
import com.codeandskills.billing_service.infrastructure.kafka.PaymentEventProducer;
import com.codeandskills.common.events.billing.PaymentFailedEvent;
import com.codeandskills.common.events.billing.PaymentRefundedEvent;
import com.codeandskills.common.events.billing.PaymentSucceededEvent;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.ApiResource;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookService {

    private final PaymentEventProducer producer;
    private final PaymentService paymentService;
    private final InvoiceService invoiceService;
    private final EnrollmentService enrollmentService;

    private final UserProfileClient userProfileClient;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    public void handle(String payload, String sigHeader) {

        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            String eventType = event.getType();
            log.info("📦 Stripe event reçu : {}", eventType);

            switch (eventType) {
                // ✅ Paiement réussi (checkout session)
                case "checkout.session.completed" -> handleCheckoutCompleted(event);

                // ✅ Confirmation backend du paiement
                case "payment_intent.succeeded" -> handlePaymentSucceeded(event);

                // ❌ Échec du paiement
                case "payment_intent.payment_failed" -> handlePaymentFailed(event);

//                case "charge.refunded" -> handleRefunded(event);

                // 💸 Remboursement total ou partiel
                case "refund.created" -> handleRefundCreated(event);

                // 🚫 Session expirée ou annulée
                case "checkout.session.expired" -> handleSessionExpired(event);

                // Par défaut, on loggue sans lever d'erreur
                default -> log.warn("⚠️ Event Stripe non géré : {}", eventType);
            }
        } catch (SignatureVerificationException e) {
            log.error("❌ Signature Stripe invalide : {}", e.getMessage());
            throw new IllegalArgumentException("Invalid payment signature");
        } catch (Exception e) {
            log.error("❌ Erreur traitement Stripe Webhook : {}", e.getMessage(), e);
            throw new IllegalArgumentException("Payment Webhook error: " + e.getMessage());
        }

    }

    private void handleRefundCreated(Event event) {
        try {
            StripeObject dataObject = event.getData().getObject();
            if (!(dataObject instanceof Refund refund)) {
                log.error("❌ handleRefundCreated: data.object n'est pas un Refund mais {}",
                        dataObject != null ? dataObject.getClass() : "null");
                return;
            }

            String paymentIntentId = refund.getPaymentIntent();
            if (paymentIntentId == null) {
                log.warn("⚠️ Aucun paymentIntentId sur refund {}", refund.getId());
                return;
            }

            String reason = refund.getReason() != null ? refund.getReason() : "unspecified";

            Payment p = paymentService.markAsRefunded(paymentIntentId, reason);
            UserProfileDTO profileDto = userProfileClient.getUserProfileById(new GetPublicUserProfile(p.getUserId()));
            Enrollment enrollment = enrollmentService.markAs(p, EnrollmentStatus.REFUNDED);
            log.info("💸 [refund.created] Paiement remboursé en BDD ({}) pour user={} ref={}",
                    p.getId(), p.getUserId(), p.getReferenceId());

            producer.publishPaymentRefunded(
                    PaymentRefundedEvent.builder()
                            .paymentId(p.getId())
                            .userId(p.getUserId())
                            .email(profileDto.getEmail())
                            .username(!profileDto.getFirstname().isEmpty() || !profileDto.getLastname().isEmpty() ? profileDto.getFirstname() + " " + profileDto.getLastname() : "Client")
                            .referenceId(p.getReferenceId())
                            .type(p.getType().toString())
                            .amount(p.getAmount().intValue())
                            .currency(p.getCurrency())
                            .refundReason(reason)
                            .stripePaymentIntentId(paymentIntentId)
                            .receiptUrl("/dashboard/invoices")
                            .refundedAt(LocalDateTime.now())
                            .build()
            );

        } catch (Exception e) {
            log.error("❌ Erreur handleRefundCreated : {}", e.getMessage(), e);
        }
    }

    private void handleCheckoutCompleted(Event event) {

        try {
            String rawJson = event.getData().getObject().toJson();

            Session session = ApiResource.GSON.fromJson(rawJson, Session.class);

            String userId = session.getMetadata().get("userId");
            String courseId = session.getMetadata().get("courseId");
            //String enrollmentId = session.getMetadata().get("enrollmentId");
            String sessionId = session.getId();
            String paymentIntentId = session.getPaymentIntent() != null ? session.getPaymentIntent() : null;
            String type = session.getMetadata().get("type");

            log.info("✅ Paiement réussi pour user={}, course={}, sessionId={} paymentId={} type={}",
                    userId, courseId, sessionId, paymentIntentId, type);

            // Met à jour le statut du paiement
            Payment p = paymentService.markAsPaid(sessionId, userId, courseId, paymentIntentId, type);
            Enrollment enrollment = enrollmentService.markAsActive(p);
            Invoice invoice = invoiceService.generateFromPayment(p);

            // Publie l’événement
            producer.publishPaymentSucceeded(
                    PaymentSucceededEvent.builder()
                            .paymentId(p.getId())
                            .userId(userId)
                            .email(session.getCustomerDetails().getEmail())
                            .username(session.getCustomerDetails().getName() != null ? session.getCustomerDetails().getName() : "Client")
                            .referenceId(courseId)
                            .type(type)
                            .amount(p.getAmount().intValue())
                            .currency(p.getCurrency())
                            .method("card")
                            .stripePaymentIntentId(paymentIntentId)
                            .stripeSessionId(sessionId)
                            .receiptUrl("/dashboard/invoices" ) //+ (invoice.getInvoiceNumber())
                            .paidAt(LocalDateTime.now())
                            .build()
            );

        } catch (Exception e) {
            log.error("❌ Erreur parsing manuel Session : {}", e.getMessage(), e);
        }
    }

    private void handlePaymentSucceeded(Event event) {
        try {
            log.info("💳 Paiement réussi (PaymentIntent) : {}", event.getId());

            // Récupération du JSON brut
            String rawJson = event.getData().getObject().toJson();

            // Parser en PaymentIntent Stripe
            com.stripe.model.PaymentIntent intent = ApiResource.GSON.fromJson(rawJson, com.stripe.model.PaymentIntent.class);

            String paymentIntentId = intent.getId();
            String status = intent.getStatus();
            Long amount = intent.getAmountReceived();
            String currency = intent.getCurrency();

            log.info("✅ PaymentIntent ID={} status={} amount={} {}", paymentIntentId, status, amount, currency);

            // Si jamais on veut retrouver un paiement local par StripePaymentIntentId
            Payment payment = paymentService.markAsPaidByIntentId(paymentIntentId);

        } catch (Exception e) {
            log.error("❌ Erreur handlePaymentSucceeded : {}", e.getMessage(), e);
        }
    }

    private void handlePaymentFailed(Event event) {
        try {
            log.warn("💥 Paiement échoué : {}", event.getId());

            String rawJson = event.getData().getObject().toJson();

            Session session = ApiResource.GSON.fromJson(rawJson, Session.class);

            String userId = session.getMetadata().get("userId");
            String courseId = session.getMetadata().get("courseId");
            String enrollmentId = session.getMetadata().get("enrollmentId");
            String sessionId = session.getId();
            String paymentIntentId = session.getPaymentIntent() != null ? session.getPaymentIntent() : null;
            String type = session.getMetadata().get("type");

            com.stripe.model.PaymentIntent intent = ApiResource.GSON.fromJson(rawJson, com.stripe.model.PaymentIntent.class);

            // String paymentIntentId = intent.getId();
            String failureCode = intent.getLastPaymentError() != null ? intent.getLastPaymentError().getCode() : "unknown";
            String failureMessage = intent.getLastPaymentError() != null ? intent.getLastPaymentError().getMessage() : "Aucune information";

            log.warn("❌ PaymentIntent {} échoué : {} - {}", paymentIntentId, failureCode, failureMessage);

            // Mise à jour du paiement local
            Payment p = paymentService.markAsFailedByIntentId(paymentIntentId, failureMessage);
            producer.publishPaymentFailed(
                    PaymentFailedEvent.builder()
                            .paymentId(paymentIntentId)
                            .userId(userId) // tu peux l’ajouter plus tard via ta table Payment
                            .referenceId(courseId)
                            .type(type)
                            .amount(p.getAmount().intValue())
                            .currency(p.getCurrency())
                            .reason(failureMessage)
                            .stripePaymentIntentId(paymentIntentId)
                            .failedAt(LocalDateTime.now())
                            .build()
            );

        } catch (Exception e) {
            log.error("❌ Erreur handlePaymentFailed : {}", e.getMessage(), e);
        }
    }

    // 🚫 checkout.session.expired
    private void handleSessionExpired(Event event) {
        try {
            String rawJson = event.getData().getObject().toJson();
            Session session = ApiResource.GSON.fromJson(rawJson, Session.class);
            String sessionId = session.getId();

            log.info("🚫 Session expirée : {}", sessionId);
            paymentService.markAsCanceled(sessionId);
        } catch (Exception e) {
            log.error("❌ Erreur handleSessionExpired : {}", e.getMessage(), e);
        }
    }

}