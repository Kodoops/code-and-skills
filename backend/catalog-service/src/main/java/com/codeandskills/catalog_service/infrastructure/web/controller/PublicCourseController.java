package com.codeandskills.catalog_service.infrastructure.web.controller;

import com.codeandskills.catalog_service.application.dto.CourseDTO;
import com.codeandskills.catalog_service.application.dto.CourseLessonCounts;
import com.codeandskills.catalog_service.application.service.CourseService;
import com.codeandskills.catalog_service.domain.model.CourseStatus;
import com.codeandskills.catalog_service.infrastructure.web.dto.ListCourseIdsRequest;
import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/catalog/public/courses")
@RequiredArgsConstructor
public class PublicCourseController {

    private final CourseService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<CourseDTO>>> getPublicCourses(
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) Boolean isFree,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<CourseDTO> filteredCourses = service.getFilteredCourses(categorySlug, level, isFree, page, size);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Cours filtrés récupérés avec succès",
                        filteredCourses
                )
        );
    }



    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getRecentCourses(
            @RequestParam(defaultValue = "6") int limit,
            @RequestParam(defaultValue = "true") boolean publishedOnly
    ) {
        List<CourseDTO> recentCourses = service.getRecentCourses(limit, publishedOnly);
        return ResponseEntity.ok(ApiResponse.success(200, "Recent courses fetched successfully", recentCourses));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> countCourses(
            @RequestParam(required = false) CourseStatus status
    ) {
        //long count = service.countCourses(status);
        CourseLessonCounts countsByStatus = service.getCountsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(200, "Courses counted successfully",
                Map.of("courses", countsByStatus.getCourses(), "lessons", countsByStatus.getLessons())));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<CourseDTO>> getCourseBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Cours récupéré avec succès",
                        service.getBySlug(slug)
                )
        );
    }


    // Inter service
    @GetMapping("/id/{id}")
    public CourseDTO getCourseById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping("/list")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getCoursesByIds(@RequestBody ListCourseIdsRequest ids) {
        List<CourseDTO> courses = service.getCoursesByIds(ids.courseIds());
        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "la liste des cours ",
                        courses
                )
        );
    }
}