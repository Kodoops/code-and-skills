package com.codeandskills.content_service.infrastructure.web.controller.admin;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.content_service.application.dto.PageDTO;
import com.codeandskills.content_service.application.service.PageService;
import com.codeandskills.content_service.infrastructure.web.dto.page.RequestPage;
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
    public ResponseEntity<ApiResponse< PagedResponse<PageDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String type
    ) {
        PagedResponse<PageDTO> pages = pageService.getAll(page, size, type);

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
                                                       @RequestBody RequestPage requestPage) {
        PageDTO pageDTO = new PageDTO();
        pageDTO.setId(id);
        pageDTO.setTitle(requestPage.title());
        pageDTO.setSlug(requestPage.slug());
        pageDTO.setContent(requestPage.content());
        pageDTO.setType(requestPage.type());

        PageDTO updated = pageService.update(id, pageDTO);
        return ResponseEntity.ok(ApiResponse.success(200, "Page updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        pageService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(200, "Page deleted successfully", null));
    }
}