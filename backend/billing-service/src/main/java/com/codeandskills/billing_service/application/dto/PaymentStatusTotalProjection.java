package com.codeandskills.billing_service.application.dto;

import com.codeandskills.billing_service.domain.models.PaymentStatus;

import java.math.BigDecimal;

public interface PaymentStatusTotalProjection {
    PaymentStatus getStatus();
    BigDecimal getTotal();
}