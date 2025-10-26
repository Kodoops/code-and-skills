package com.codeandskills.catalog_service.infrastructure.web.controller.admin;

import com.codeandskills.catalog_service.application.dto.CategoryDTO;
import com.codeandskills.catalog_service.application.mapper.CategoryMapper;
import com.codeandskills.catalog_service.application.service.CategoryService;
import com.codeandskills.catalog_service.application.service.DomainService;
import com.codeandskills.catalog_service.domain.model.Category;
import com.codeandskills.catalog_service.domain.model.Domain;
import com.codeandskills.catalog_service.infrastructure.web.dto.CategoryRequest;
import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/catalog/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService service;
    @Qualifier("categoryMapper")
    private final CategoryMapper mapper;
    private final DomainService domainService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getById(@PathVariable("id") String id) {

        Optional<Category> category = service.findById(id);
        if (!category.isPresent()) {
            ApiResponse.success(200, "Category got successfully",null );
        }
        return ResponseEntity.ok(
                ApiResponse.success(200, "Domain got successfully",mapper.toDto(category.get()) )
        );
    }


    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<CategoryDTO>>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "perPage", defaultValue = "10") int perPage,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "direction", defaultValue = "desc") String direction
    ) {
        Page<Category> categories = service.findAll(page, perPage, sortBy, direction);
        PagedResponse<CategoryDTO> pagedResponse = mapper.toPagedResponse(categories);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Categories fetched successfully", pagedResponse)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> create(@RequestBody CategoryRequest request) {
        Optional<Domain> domain = domainService.findById(request.domainId());

        if (domain.isPresent()) {
            Category category = service.create(request, domain.get());
            return ResponseEntity.ok(
                    ApiResponse.success(200, "Category created successfully", mapper.toDto(category))
            );
        } else {
            throw new IllegalArgumentException("Domain not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> update(@PathVariable String id, @RequestBody CategoryRequest request) {
        Optional<Domain> domain = domainService.findById(request.domainId());

        if (domain.isPresent()) {
            Category updated = service.update(id, request, domain.get());
            return ResponseEntity.ok(
                    ApiResponse.success(200, "Category updated successfully", mapper.toDto(updated))
            );
        } else {
            throw new IllegalArgumentException("Domain not found");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Category deleted successfully", null)
        );
    }
}