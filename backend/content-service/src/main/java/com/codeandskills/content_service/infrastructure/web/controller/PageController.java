package com.codeandskills.content_service.infrastructure.web.controller;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.content_service.application.dto.PageDTO;
import com.codeandskills.content_service.application.service.PageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/content/pages")
@RequiredArgsConstructor
public class PageController {

    private final PageService pageService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PageDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        PagedResponse<PageDTO> filteredFeatures = pageService.getAllPaged(page, size);

        return ResponseEntity.ok(ApiResponse.success(200, "Pages fetched successfully", filteredFeatures));
    }


    @GetMapping("/type")
    public ResponseEntity<ApiResponse<List<PageDTO>>> getFooterPages(@RequestParam(name = "type", required = true) String type) {

        List<PageDTO> filteredFeatures = pageService.getPagesByType(type.toLowerCase());

        return ResponseEntity.ok(ApiResponse.success(200, "Footer Pages fetched successfully", filteredFeatures));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PageDTO>> getPageBySlug(@PathVariable String slug) {

        PageDTO filteredFeatures = pageService.getPagesBySlug(slug);

        return ResponseEntity.ok(ApiResponse.success(200, "Footer Pages fetched successfully", filteredFeatures));
    }

}