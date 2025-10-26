package com.codeandskills.billing_service.infrastructure.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class EnsureCustomerRequest { @NotBlank
private String userId; }

