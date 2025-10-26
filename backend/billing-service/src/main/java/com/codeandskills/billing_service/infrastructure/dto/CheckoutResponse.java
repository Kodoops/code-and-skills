package com.codeandskills.billing_service.infrastructure.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class CheckoutResponse {
    private String checkoutUrl;
    private String paymentId;
}