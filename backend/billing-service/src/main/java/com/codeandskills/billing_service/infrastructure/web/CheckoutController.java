package com.codeandskills.billing_service.infrastructure.web;

import com.codeandskills.billing_service.application.service.BillingService;
import com.codeandskills.billing_service.infrastructure.dto.CheckoutResponse;
import com.codeandskills.billing_service.infrastructure.dto.CourseCheckoutRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/billing/checkout")
@RequiredArgsConstructor
@Slf4j
public class CheckoutController {

    private final BillingService billingService;

    @PostMapping("/course")
    public ResponseEntity<CheckoutResponse> createCourseCheckout(@RequestBody @Valid CourseCheckoutRequest req)
            throws Exception {
        log.info("Create course checkout: {}", req);
        return ResponseEntity.ok(billingService.createCourseCheckout(req));
    }
}
