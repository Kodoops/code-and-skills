package com.codeandskills.billing_service.application.dto;

import java.math.BigDecimal;

public record InvoiceItemDTO(
        String id,
        String title,
        String type,
        String referenceId,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal total
) {}
