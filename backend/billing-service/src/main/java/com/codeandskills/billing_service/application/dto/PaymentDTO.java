package com.codeandskills.billing_service.application.dto;

import com.codeandskills.billing_service.domain.models.InvoiceItemType;
import com.codeandskills.billing_service.domain.models.PaymentStatus;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
public class PaymentDTO  {

    private String id;

    private String userId;

    private String referenceId; // courseId (ou learningPathId)

    private InvoiceItemType type; // "COURSE", "SUBSCRIPTION", ...

    private String stripeId;       // checkout session id
    private String stripePaymentIntentId;
    private String stripeRefundId;

    private BigDecimal amount;

    private String currency;

    private PaymentStatus status;

    private String method;   // “card”
    private String receiptUrl;
}