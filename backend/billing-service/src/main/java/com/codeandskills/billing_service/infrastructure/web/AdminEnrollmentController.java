package com.codeandskills.billing_service.infrastructure.web;

import com.codeandskills.billing_service.application.dto.EnrollmentDTO;
import com.codeandskills.billing_service.application.service.EnrollmentService;
import com.codeandskills.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("billing/admin/enrollments")
@RequiredArgsConstructor
@Slf4j
public class AdminEnrollmentController {

    private  final EnrollmentService enrollmentService;

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<List<EnrollmentDTO>>> countEnrollments() {
        List<EnrollmentDTO> enrollments = enrollmentService.getAll();
        return ResponseEntity.ok(
                ApiResponse.success(   200, "Enrollment actifs de user ",enrollments)
        );
    }
}
