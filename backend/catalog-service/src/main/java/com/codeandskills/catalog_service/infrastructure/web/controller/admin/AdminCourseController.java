package com.codeandskills.catalog_service.infrastructure.web.controller.admin;

import com.codeandskills.catalog_service.application.dto.CourseDTO;
import com.codeandskills.catalog_service.application.service.CategoryService;
import com.codeandskills.catalog_service.application.service.CourseService;
import com.codeandskills.catalog_service.domain.model.*;
import com.codeandskills.catalog_service.infrastructure.web.dto.CourseRequest;
import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/catalog/admin/courses")
@RequiredArgsConstructor
public class AdminCourseController {

    private final CourseService service;
    private final CategoryService   categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<CourseDTO>>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Liste des cours récupérée avec succès",
                        service.getAllCourses(page, size)
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> getById(@PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Cours récupéré avec succès",
                        service.getById(id)
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CourseDTO>> create(@RequestBody CourseRequest request,
                                                         @RequestHeader("X-User-Id") String userId,
                                                         @RequestHeader("X-User-Role") String role) {

        if (!role.equals("ADMIN") && !role.equals("INSTRUCTOR")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Category> category = categoryService.findById(request.categoryId());
        if(!category.isPresent()) {
            throw new IllegalArgumentException("Category not found");
        }

        CourseDTO created = service.createCourse(
                Course.builder()
                        .title(request.title())
                        .slug(request.slug().toLowerCase())
                        .smallDescription(request.smallDescription())
                        .description(request.description())
                        .price(request.price())
                        .currency(request.currency().toUpperCase())
                        .duration(request.duration())
                        .level(Level.valueOf(request.level().toUpperCase()))
                        .fileKey(request.fileKey())
                        .userId(request.userId())
                        .category(category.get())
                      //  .status(CourseStatus.valueOf(request.status().toUpperCase()))
                        .build()
        );
        return ResponseEntity.ok(
                ApiResponse.success(201, "Cours créé avec succès", created)
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> update(@PathVariable String id, @RequestBody CourseRequest request) {

        Optional<Category> category = categoryService.findById(request.categoryId());
        if(!category.isPresent()) {
            throw new IllegalArgumentException("Category not found");
        }

        CourseDTO updated = service.updateCourse(
                id,
                Course.builder()
                        .title(request.title())
                        .slug(request.slug())
                        .smallDescription(request.smallDescription())
                        .description(request.description())
                        .price(request.price())
                        .currency(request.currency().toUpperCase())
                        .duration(request.duration())
                        .level(Level.valueOf(request.level().toUpperCase()))
                        .fileKey(request.fileKey())
                        .userId(request.userId())
                        .category(category.get())
                        .status(CourseStatus.valueOf(request.status().toUpperCase()))
                        .build()
        );
        return ResponseEntity.ok(
                ApiResponse.success(200, "Cours mis à jour avec succès", updated)
        );
    }


    // 🔹 Publier un cours
    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<CourseDTO>> publishCourse(
            @PathVariable String id,
            @RequestHeader("X-User-Role") String role) {

        if (!role.equals("ADMIN") && !role.equals("INSTRUCTOR")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        CourseDTO published = service.publishCourse(id);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Cours publié ",published)
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.deleteCourse(id);
        return ResponseEntity.ok(
                ApiResponse.success(200,  "Cours supprimé avec succès", null)
        );
    }

    // 🔹 Mise à jour uniquement des objectifs
    @PatchMapping("/{id}/objectives")
    public ResponseEntity<ApiResponse<CourseDTO>> updateObjectives(
            @PathVariable String id,
            @RequestBody java.util.List<String> objectives
    ) {
        CourseDTO updated = service.updateObjectives(id, objectives);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Objectives updated successfully", updated)
        );
    }

    // 🔹 Mise à jour uniquement des prérequis
    @PatchMapping("/{id}/prerequisites")
    public ResponseEntity<ApiResponse<CourseDTO>> updatePrerequisites(
            @PathVariable String id,
            @RequestBody java.util.List<String> prerequisites
    ) {
        CourseDTO updated = service.updatePrerequisites(id, prerequisites);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Prerequisites updated successfully", updated)
        );
    }

    /**
     * 🔄 Met à jour les tags associés à un cours
     */
    @PatchMapping("/{courseId}/tags")
    public ResponseEntity<ApiResponse<Course>> updateCourseTags(
            @PathVariable String courseId,
            @RequestBody List<String> tagIds
    ) {
        Course updated = service.updateCourseTags(courseId, tagIds);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Tags mis à jour avec succès", updated)
        );
    }

}