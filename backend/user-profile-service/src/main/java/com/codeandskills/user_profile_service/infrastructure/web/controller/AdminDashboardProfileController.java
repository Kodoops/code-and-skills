package com.codeandskills.user_profile_service.infrastructure.web.controller;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.user_profile_service.application.service.UserProfileService;
import com.codeandskills.user_profile_service.infrastructure.web.dto.ProfileStatsResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/profiles/admin/dashboard")
public class AdminDashboardProfileController {

    private final UserProfileService service;

    public AdminDashboardProfileController(UserProfileService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileStatsResponse>> getProfileStats(
            @RequestParam(required = false) String status
    ) {

        ProfileStatsResponse globalStats = service.getProfilesStats(status);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Liste des cours récupérée avec succès",
                        globalStats
                )
        );
    }

}
