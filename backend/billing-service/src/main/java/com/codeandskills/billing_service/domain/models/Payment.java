package com.codeandskills.billing_service.domain.models;

import jakarta.persistence.*;
import lombok.*;

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
    private String type; // "COURSE", "SUBSCRIPTION", ...

    private String stripeId;       // checkout session id
    private String stripePaymentIntentId;

    @Column(nullable = false)
    private Integer amount;

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