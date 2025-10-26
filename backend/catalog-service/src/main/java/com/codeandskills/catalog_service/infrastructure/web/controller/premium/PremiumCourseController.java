package com.codeandskills.catalog_service.infrastructure.web.controller.premium;

import com.codeandskills.catalog_service.application.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/catalog/premium")
@RequiredArgsConstructor
public class PremiumCourseController {

    private final CourseService courseService;

    @GetMapping("/course/{id}/content")
    public ResponseEntity<?> getCourseContent(@PathVariable String id,
                                              @RequestHeader("X-User-Id") String userId,
                                              @RequestHeader(value = "X-Subscription-Status", required = false) String status) {

        if (!"ACTIVE".equals(status)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Vous devez avoir un abonnement actif pour accéder à ce contenu.");
        }

        return ResponseEntity.ok( null);
    }
}