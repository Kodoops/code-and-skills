package com.codeandskills.notification_service.infrastructure.kafka.listener;

import com.codeandskills.common.events.billing.PaymentFailedEvent;
import com.codeandskills.common.events.billing.PaymentRefundedEvent;
import com.codeandskills.common.events.billing.PaymentSucceededEvent;
import com.codeandskills.notification_service.application.service.MailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static com.codeandskills.common.events.KafkaTopics.PAYMENT_SUCCEEDED;

@Slf4j
@Component
public class PaymentEventListener {

    @Value("${app.frontendUrl}")
    private String frontendUrl;

    private final MailService mailService;
    public PaymentEventListener(MailService mailService) {
        this.mailService = mailService;
    }

    // ✅ Paiement réussi
    @KafkaListener(topics = PAYMENT_SUCCEEDED, groupId = "notification-service")
    public void onPaymentSucceeded(PaymentSucceededEvent event) {
        log.info("📥 [Kafka] PaymentSucceededEvent reçu : {}", event);
        Map<String, Object> variables = new HashMap<>();
        variables.put("paymentId", event.getPaymentId());
        variables.put("amount", event.getAmount() / 100); // envoyé en euros
        variables.put("currency", event.getCurrency());
        variables.put("userName" , event.getUsername());
        variables.put("receiptUrl" , frontendUrl + event.getReceiptUrl());
        variables.put("supportLink", frontendUrl + "/contact");

        if (event.getEmail() == null || event.getEmail().isBlank()) {
            log.warn("⚠️ Email manquant pour PaymentRefundedEvent (paymentId={}), on ne peut pas envoyer de mail.",
                    event.getPaymentId());
            // soit on s'arrête là
            return;
            // OU alors on va chercher l'email via userId (appel REST au user-service)
        }

        mailService.sendEmail(
                event.getEmail(),
                "✅ Paiement confirmé",
                "payment-success", // ex: "verify-account"
                variables
        );
    }

    // 💥 Paiement échoué
    @KafkaListener(topics = "payment.failed", groupId = "notification-service")
    public void onPaymentFailed(PaymentFailedEvent event) {

        log.info("📥 [Kafka] sendPaymentFailedEmail reçu : {}", event);
        Map<String, Object> variables = new HashMap<>();
        variables.put("paymentId", event.getPaymentId());
        variables.put("amount", event.getAmount() / 100); // envoyé en euros
        variables.put("currency", event.getCurrency());
        variables.put("userName" , event.getUsername());
        variables.put("receiptUrl" , frontendUrl + event.getReceiptUrl());
        variables.put("supportLink", frontendUrl + "/contact");

        if (event.getEmail() == null || event.getEmail().isBlank()) {
            log.warn("⚠️ Email manquant pour PaymentRefundedEvent (paymentId={}), on ne peut pas envoyer de mail.",
                    event.getPaymentId());
            // soit on s'arrête là
            return;
            // OU alors on va chercher l'email via userId (appel REST au user-service)
        }

        mailService.sendEmail(
                event.getEmail(),
                "✅ Paiement échoué",
                "payment-failed", // ex: "verify-account"
                variables
        );
    }

    // 💸 Paiement remboursé
    @KafkaListener(topics = "payment.refunded", groupId = "notification-service")
    public void onPaymentRefunded(PaymentRefundedEvent event) {

        log.info("📥 [Kafka] PaymentRefundedEvent reçu : {}", event);
        Map<String, Object> variables = new HashMap<>();
        variables.put("paymentId", event.getPaymentId());
        variables.put("amount", event.getAmount() / 100); // envoyé en euros
        variables.put("currency", event.getCurrency());
        variables.put("userName" , event.getUsername());
        variables.put("receiptUrl" , frontendUrl + event.getReceiptUrl());
        variables.put("supportLink", frontendUrl + "/contact");

        if (event.getEmail() == null || event.getEmail().isBlank()) {
            log.warn("⚠️ Email manquant pour PaymentRefundedEvent (paymentId={}), on ne peut pas envoyer de mail.",
                    event.getPaymentId());
            // soit on s'arrête là
            return;
            // OU alors on va chercher l'email via userId (appel REST au user-service)
        }

        mailService.sendEmail(
                event.getEmail(),
                "✅ Remboursement éffectué",
                "payment-refunded", // ex: "verify-account"
                variables
        );
    }
}
