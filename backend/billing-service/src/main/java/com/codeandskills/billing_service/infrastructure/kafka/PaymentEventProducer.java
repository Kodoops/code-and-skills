package com.codeandskills.billing_service.infrastructure.kafka;

import com.codeandskills.common.events.billing.PaymentFailedEvent;
import com.codeandskills.common.events.billing.PaymentRefundedEvent;
import com.codeandskills.common.events.billing.PaymentSucceededEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import static com.codeandskills.common.events.KafkaTopics.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    // ✅ Paiement réussi
    public void publishPaymentSucceeded(PaymentSucceededEvent event) {
        kafkaTemplate.send(PAYMENT_SUCCEEDED, event).whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("❌ [Kafka] Erreur envoi PaymentSucceededEvent : {}", ex.getMessage(), ex);
            } else {
                log.info("📤 [Kafka] PaymentSucceededEvent publié sur topic={} partition={} offset={}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });
    }

    // 💥 Paiement échoué
    public void publishPaymentFailed(PaymentFailedEvent event) {
        kafkaTemplate.send(PAYMENT_FAILED, event).whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("❌ [Kafka] Erreur envoi PaymentFailedEvent : {}", ex.getMessage(), ex);
            } else {
                log.info("📤 [Kafka] PaymentFailedEvent publié sur topic={} partition={} offset={}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });
    }

    // 💸 Paiement remboursé
    public void publishPaymentRefunded(PaymentRefundedEvent event) {
        kafkaTemplate.send(PAYMENT_REFUNDED, event).whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("❌ [Kafka] Erreur envoi PaymentRefundedEvent : {}", ex.getMessage(), ex);
            } else {
                log.info("📤 [Kafka] PaymentRefundedEvent publié sur topic={} partition={} offset={}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });
    }
}