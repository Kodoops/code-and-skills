package com.codeandskills.common.events.billing;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentRefundedEvent {
    private String paymentId;
    private String userId;
    private String referenceId;
    private String type;
    private Integer amount;
    private String currency;
    private String refundReason;
    private String stripePaymentIntentId;
    private LocalDateTime refundedAt;
}