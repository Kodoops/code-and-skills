package com.codeandskills.common.events.billing;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentFailedEvent {
    private String paymentId;
    private String userId;
    private String referenceId; // courseId, subscriptionId, etc.
    private String type; // "COURSE", "SUBSCRIPTION", etc.
    private Integer amount;
    private String currency;
    private String reason;
    private String stripePaymentIntentId;
    private LocalDateTime failedAt;
}