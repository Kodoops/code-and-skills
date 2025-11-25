package com.codeandskills.billing_service.domain.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "invoice_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(nullable = false)
    private String title;

    /**
     * Type métier : "COURSE", "SUBSCRIPTION", etc.
     */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InvoiceItemType type;

    /**
     * Référence métier : courseId, subscriptionId, etc.
     */
    @Column(nullable = false)
    private String referenceId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
}