package com.codeandskills.billing_service.infrastructure.web;


import com.codeandskills.billing_service.application.service.EnrollmentStatsService;
import com.codeandskills.billing_service.infrastructure.dto.EnrollmentDailyStatResponse;
import com.codeandskills.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/billing/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final EnrollmentStatsService enrollmentStatsService;

    @GetMapping("/enrollments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<EnrollmentDailyStatResponse>>> getEnrollmentsStats(
            @RequestParam(name = "days", required = false) Integer days
    ) {
        List<EnrollmentDailyStatResponse> stats = enrollmentStatsService.getEnrollmentsStats(days);

        return ResponseEntity.ok(
                ApiResponse.success(200, "📈 Enrollments stats récupérées avec succès", stats)
        );
    }
}