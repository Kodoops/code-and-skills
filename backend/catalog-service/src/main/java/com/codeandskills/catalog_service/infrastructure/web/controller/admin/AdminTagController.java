package com.codeandskills.catalog_service.infrastructure.web.controller.admin;

import com.codeandskills.catalog_service.application.dto.TagDTO;
import com.codeandskills.catalog_service.application.mapper.TagMapper;
import com.codeandskills.catalog_service.application.service.TagService;
import com.codeandskills.catalog_service.domain.model.Tag;
import com.codeandskills.catalog_service.infrastructure.web.dto.TagRequest;
import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalog/admin/tags")
@RequiredArgsConstructor
public class AdminTagController {

    private final TagService service;
    @Qualifier("tagMapper")
    private final TagMapper mapper;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<TagDTO>>> getAllTags() {
        return ResponseEntity.ok(
                ApiResponse.success(200,"Tags fetched successfully", service.getAll())
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<TagDTO>>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "perPage", defaultValue = "10") int perPage,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name="direction" ,defaultValue = "desc") String direction
    ) {
        Page<Tag> tags = service.findAll(page, perPage, sortBy, direction);
        PagedResponse<TagDTO> pagedResponse = mapper.toPagedResponse(tags);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Tags fetched successfully", pagedResponse)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TagDTO>> getTagById(@PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.success(200, "Tag fetched successfully", service.getById(id))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TagDTO>> createTag(@RequestBody TagRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(200, "Tag created successfully", service.create(request))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TagDTO>> updateTag(@PathVariable String id, @RequestBody TagRequest request) {
       return ResponseEntity.ok(
               ApiResponse.success(200, "Tag updated successfully", service.update(id, request))
       );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>>deleteTag(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(
                ApiResponse.success( 200, "Tag deleted successfully", null)
        );
    }
}