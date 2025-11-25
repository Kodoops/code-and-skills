package com.codeandskills.catalog_service.infrastructure.web.controller.admin;

import com.codeandskills.catalog_service.application.service.GlobalStatsService;
import com.codeandskills.catalog_service.infrastructure.web.dto.GlobalStatsResponse;
import com.codeandskills.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/catalog/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final GlobalStatsService service;

    @GetMapping
    public ResponseEntity<ApiResponse<GlobalStatsResponse>> getGlobalStats(
            @RequestParam(required = false) String status
    ) {

        GlobalStatsResponse globalStats = service.getGlobalStats(status);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Liste des cours récupérée avec succès",
                    globalStats
                )
        );
    }
}
