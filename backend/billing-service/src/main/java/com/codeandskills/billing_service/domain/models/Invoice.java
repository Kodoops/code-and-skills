package com.codeandskills.billing_service.domain.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice extends BaseEntity {

    @Column(nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String paymentId;

    @Column(nullable = false)
    private String invoiceNumber;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false)
    private String currency;

    private Double taxRate;
    private Double taxAmount;
    private String description;

    private String pdfUrl;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status; // GENERATED, SENT, PAID, CANCELED
}