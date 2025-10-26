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
        kafkaTemplate.send(PAYMENT_SUCCEEDED, event);
        log.info("📤 [Kafka] PaymentSucceededEvent publié : {}", event);
    }

    // 💥 Paiement échoué
    public void publishPaymentFailed(PaymentFailedEvent event) {
        kafkaTemplate.send(PAYMENT_FAILED, event);
        log.warn("📤 [Kafka] PaymentFailedEvent publié : {}", event);
    }

    // 💸 Paiement remboursé
    public void publishPaymentRefunded(PaymentRefundedEvent event) {
        kafkaTemplate.send(PAYMENT_REFUNDED, event);
        log.info("📤 [Kafka] PaymentRefundedEvent publié : {}", event);
    }
}