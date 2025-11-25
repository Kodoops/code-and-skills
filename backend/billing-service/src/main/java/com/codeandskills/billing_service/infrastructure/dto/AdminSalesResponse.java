package com.codeandskills.billing_service.infrastructure.dto;


import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AdminSalesResponse {

    // Totaux par statut
    private BigDecimal totalPaid;
    private BigDecimal totalPending;
    private BigDecimal totalFailed;
    private BigDecimal totalRefunded;

    // Total général (tous statuts confondus)
    private BigDecimal grandTotal;
}