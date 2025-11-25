package com.codeandskills.billing_service.application.dto;

import com.codeandskills.billing_service.domain.models.InvoiceStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Value
@Data
@Builder
@AllArgsConstructor
public class InvoiceDTO {
    private String id;
    private String tenantId;

    private String paymentId;

    private String invoiceNumber;

    private BigDecimal amount;

    private String currency;

    private Double taxRate;
    private Double taxAmount;
    private String description;

    private String pdfUrl;

    private InvoiceStatus status;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    List<InvoiceItemDTO> items;
}
