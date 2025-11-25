package com.codeandskills.billing_service.infrastructure.web;

import com.codeandskills.billing_service.application.service.BillingService;
import com.codeandskills.billing_service.infrastructure.web.dto.BillingStatsResponse;
import com.codeandskills.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/billing/admin/dashboard")
public class AdminDashboardController {

    private final BillingService service;

    public AdminDashboardController(BillingService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<BillingStatsResponse>> getProfileStats() {
        BillingStatsResponse globalStats = new BillingStatsResponse();
         long customers = service.getBillingStats();

         globalStats.setCustomersCount((int) customers);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Liste des stats récupérée avec succès",
                        globalStats
                )
        );
    }
}
