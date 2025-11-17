package com.codeandskills.content_service.infrastructure.web.controller;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.content_service.application.dto.FeatureDTO;
import com.codeandskills.content_service.application.service.FeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/content/features")
@RequiredArgsConstructor
public class FeatureController {

    private final FeatureService featureService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<FeatureDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        PagedResponse<FeatureDTO> filteredFeatures = featureService.getAllPaged(page, size);

        return ResponseEntity.ok(ApiResponse.success(200, "Features fetched successfully", filteredFeatures));
    }

}