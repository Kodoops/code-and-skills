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
public class PaymentRefundedEvent {
    private String paymentId;
    private String userId;
    private String username;
    private String email;
    private String referenceId;
    private String type;
    private Integer amount;
    private String currency;
    private String refundReason;
    private String stripePaymentIntentId;
    private String receiptUrl;
    private LocalDateTime refundedAt;
}