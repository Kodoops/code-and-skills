package com.codeandskills.common.events.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentSucceededEvent {
    private String paymentId;
    private String userId;
    private String username;
    private String email;
    private String referenceId; // courseId
    private String type;        // "COURSE"
    private Integer amount;
    private String currency;
    private String method;
    private String stripePaymentIntentId;
    private String stripeSessionId;
    private String receiptUrl;
    private LocalDateTime paidAt;
}