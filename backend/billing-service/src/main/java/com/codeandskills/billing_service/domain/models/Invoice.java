package com.codeandskills.billing_service.domain.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    private Double taxRate;
    private Double taxAmount;
    private String description;

    private String pdfUrl;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status; // GENERATED, SENT, PAID, CANCELED, REFUNDED

    @OneToMany(
            mappedBy = "invoice",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<InvoiceItem> items = new ArrayList<>();

    public void addItem(InvoiceItem item) {
        if (items == null) {
            items = new ArrayList<>();
        }
        items.add(item);
        item.setInvoice(this);
    }

    public void removeItem(InvoiceItem item) {
        if (items != null) {
            items.remove(item);
            item.setInvoice(null);
        }
    }
}