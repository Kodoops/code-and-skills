package com.codeandskills.common.events.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentFailedEvent {
    private String paymentId;
    private String userId;
    private String username;
    private String email;
    private String referenceId; // courseId, subscriptionId, etc.
    private String type; // "COURSE", "SUBSCRIPTION", etc.
    private Integer amount;
    private String currency;
    private String reason;
    private String stripePaymentIntentId;
    private String receiptUrl;
    private LocalDateTime failedAt;
}