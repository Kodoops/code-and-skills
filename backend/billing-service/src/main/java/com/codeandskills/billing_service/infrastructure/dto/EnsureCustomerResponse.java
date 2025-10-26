package com.codeandskills.billing_service.infrastructure.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EnsureCustomerResponse { private String stripeCustomerId; }
