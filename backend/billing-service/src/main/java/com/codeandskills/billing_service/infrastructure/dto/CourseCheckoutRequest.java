package com.codeandskills.billing_service.infrastructure.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseCheckoutRequest {
    @NotBlank private String userId;
    @NotBlank private String email;
    @NotBlank private String courseId;
    @NotBlank private String courseTitle;
    @NotBlank private String stripeCustomerId;
    @NotNull private Integer amount;   // en centimes
    @NotBlank private String currency;  // "eur"
}
