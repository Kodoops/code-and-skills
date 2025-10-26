package com.codeandskills.catalog_service.infrastructure.web.controller;

import com.codeandskills.catalog_service.application.dto.CourseDTO;
import com.codeandskills.catalog_service.application.service.CourseService;
import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/catalog/user/courses")
@RequiredArgsConstructor
public class UserCourseController {

    private final CourseService courseService;

    // 🔹 Liste des cours créés par un formateur
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedResponse<CourseDTO>>> getMyCourses(@RequestHeader("X-User-Id") String userId,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Liste des cours utilisateur récupérée avec succès",
                        courseService.getByUserId(userId, page, size)
                )
        );
    }

    // 🔹 Supprimer un cours (si propriétaire)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable String id, @RequestHeader("X-User-Id") String userId) {
        courseService.deleteUserCourse(id, userId);

        return ResponseEntity.ok(
          ApiResponse.success(200, "Cours supprimé avec succès ", null)
        );
    }
}