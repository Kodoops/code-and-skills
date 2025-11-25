package com.codeandskills.billing_service.domain.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity{

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String referenceId; // courseId (ou learningPathId)

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InvoiceItemType type; // "COURSE", "SUBSCRIPTION", ...

    private String stripeId;       // checkout session id
    private String stripePaymentIntentId;
    private String stripeRefundId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status;

    private String method;   // “card”
    private String receiptUrl;

    public boolean isPaid() {
        return this.status == PaymentStatus.PAID;
    }

    public boolean isPending() {
        return this.status == PaymentStatus.PENDING;
    }

    public boolean isFailed() {
        return this.status == PaymentStatus.FAILED;
    }
}