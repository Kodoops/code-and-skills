package com.codeandskills.billing_service.infrastructure.web;

import com.codeandskills.billing_service.application.service.CustomerService;
import com.codeandskills.billing_service.infrastructure.dto.EnsureCustomerRequest;
import com.codeandskills.billing_service.infrastructure.dto.EnsureCustomerResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/billing/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService service;

    @PostMapping("/ensure")
    public ResponseEntity<EnsureCustomerResponse> ensure(@RequestBody @Valid EnsureCustomerRequest req) throws Exception {
        return ResponseEntity.ok(service.ensureCustomer(req.getUserId()));
    }
}
