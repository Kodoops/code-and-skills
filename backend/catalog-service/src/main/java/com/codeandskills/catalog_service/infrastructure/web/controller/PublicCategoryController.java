package com.codeandskills.catalog_service.infrastructure.web.controller;

import com.codeandskills.catalog_service.application.dto.CategoryDTO;
import com.codeandskills.catalog_service.application.mapper.CategoryMapper;
import com.codeandskills.catalog_service.application.service.CategoryService;
import com.codeandskills.catalog_service.domain.model.Category;
import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalog/public/categories")
@RequiredArgsConstructor
public class PublicCategoryController {

    private final CategoryService service;
    @Qualifier("categoryMapper")
    private final CategoryMapper mapper;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<CategoryDTO>>> getCategories(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "perPage", defaultValue = "10") int perPage,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name="direction" ,defaultValue = "desc") String direction
    ) {
        Page<Category> categories = service.findAll(page, perPage, sortBy, direction);
        PagedResponse<CategoryDTO> pagedResponse = mapper.toPagedResponse(categories);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Categories fetched successfully", pagedResponse)
        );
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAll() {
        List<Category> categories = service.findAll();

        return ResponseEntity.ok(
                ApiResponse.success(200, "Categories fetched successfully", mapper.toDtoList(categories))
        );
    }


    @GetMapping("/domain/{slug}")
    public ResponseEntity<ApiResponse<PagedResponse<CategoryDTO>>> getByDomain(
            @PathVariable("slug") String slug,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "perPage", defaultValue = "10") int perPage,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name="direction" ,defaultValue = "desc") String direction
    ) {
        Page<Category> categories = service.findByDomain(slug, page, perPage, sortBy, direction);
        PagedResponse<CategoryDTO> pagedResponse = mapper.toPagedResponse(categories);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Categories by domain fetched successfully", pagedResponse)
        );
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getBySlug(@PathVariable("slug")  String slug) {
        return ResponseEntity.ok(
                ApiResponse.success(200, "Category got successfully", mapper.toDto(service.findBySlug(slug)))
        );
    }

    /**
     * 🔹 Récupère les catégories les plus peuplées (avec le plus de cours)
     * Exemple : GET /catalog/public/categories/popular?limit=5
     */
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getMostPopularCategories(
            @RequestParam(defaultValue = "5") int limit
    ) {
        if (limit <= 0) limit = 5;
        List<Category> result = service.getMostPopularCategories(limit);
        return ResponseEntity.ok(ApiResponse.success(
                200,
                "Most popular categories fetched successfully",
                mapper.toDtoList(result)
        ));
    }

}