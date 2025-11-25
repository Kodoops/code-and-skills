package com.codeandskills.billing_service.infrastructure.web;

import com.codeandskills.billing_service.application.dto.EnrollmentDTO;
import com.codeandskills.billing_service.application.service.EnrollmentService;
import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/billing/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<EnrollmentDTO>>> getEnrollmentsByUser(@PathVariable String userId) {
        List<EnrollmentDTO> enrollments = enrollmentService.getUserEnrollments(userId);
        return ResponseEntity.ok(
             ApiResponse.success(   200, "Enrollment user réccupérés ",enrollments)
        );
    }

    @GetMapping("/user/{userId}/all/active")
    public ResponseEntity<ApiResponse<PagedResponse<EnrollmentDTO>>> getAllActiveEnrollmentsByUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<EnrollmentDTO> pagedResponse =
                enrollmentService.getUserEnrollmentsWithPaymentsAndCourses(userId, page, size);

        return ResponseEntity.ok(
                ApiResponse.success(200, "📦 Enrollments actifs récupérés avec succès", pagedResponse)
        );
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<ApiResponse<List<EnrollmentDTO>>> getActiveEnrollmentsByUser(@PathVariable String userId) {
        List<EnrollmentDTO> enrollments = enrollmentService.getActiveEnrollments(userId);
        return ResponseEntity.ok(
                ApiResponse.success(   200, "Enrollment actifs de user ",enrollments)
        );
    }

    @GetMapping("/user/{userId}/course/{courseId}")
    public ResponseEntity<ApiResponse<?>> checkIfCourseIsBoughtByUser(@PathVariable String userId,
                                                                                        @PathVariable String courseId) {
        EnrollmentDTO enrollment = enrollmentService.checkIfProductIsBoughtByUser(courseId, userId);
        if (enrollment == null) {
            return ResponseEntity.ok(
                    ApiResponse.error(   200, "error", "Aucun achat de trouvé pour cet utilisateur ","/enrollment")
            );
        }
        return ResponseEntity.ok(
                ApiResponse.success(   200, "Enrollment actifs de user ",enrollment)
        );
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<ApiResponse<List<EnrollmentDTO>>> countUserEnrollments(@PathVariable String userId) {
        List<EnrollmentDTO> enrollments = enrollmentService.getUserEnrollments(userId);
        return ResponseEntity.ok(
                ApiResponse.success(   200, "Enrollment actifs de user ",enrollments)
        );
    }

}