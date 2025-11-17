package com.codeandskills.content_service.infrastructure.web.controller.admin;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.content_service.application.dto.PageDTO;
import com.codeandskills.content_service.application.service.PageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/content/admin/pages")
@RequiredArgsConstructor
public class PageAdminController {

    private final PageService pageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PageDTO>>> getAll() {
        List<PageDTO> pages = pageService.getAll();
        return ResponseEntity.ok(ApiResponse.success(200, "Pages fetched successfully", pages));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PageDTO>> getById(@PathVariable String id) {
        Optional<PageDTO> dto = pageService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(200, "Page fetched successfully", dto.orElse(null)));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<PageDTO>> getBySlug(@PathVariable String slug) {
        Optional<PageDTO> dto = pageService.getBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(200, "Page fetched successfully by slug", dto.orElse(null)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PageDTO>> create(@RequestBody PageDTO dto) {
        PageDTO created = pageService.create(dto);
        return ResponseEntity.ok(ApiResponse.success(201, "Page created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PageDTO>> update(@PathVariable String id,
                                                       @RequestBody PageDTO dto) {
        PageDTO updated = pageService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(200, "Page updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        pageService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(200, "Page deleted successfully", null));
    }
}