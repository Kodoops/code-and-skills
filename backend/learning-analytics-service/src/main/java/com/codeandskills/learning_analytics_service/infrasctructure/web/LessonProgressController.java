package com.codeandskills.learning_analytics_service.infrasctructure.web;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.learning_analytics_service.application.service.LessonProgressService;
import com.codeandskills.learning_analytics_service.domain.model.LessonProgress;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/learning-analytics/progress")
@RequiredArgsConstructor
public class LessonProgressController {

    private final LessonProgressService service;

    @PostMapping("/{courseId}/{lessonId}/complete")
    public ResponseEntity<ApiResponse<LessonProgress>> markCompleted(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String courseId,
            @PathVariable String lessonId) {

        LessonProgress result = service.markLessonCompleted(userId, courseId, lessonId);
        return ResponseEntity.ok(ApiResponse.success(200, "Lesson marked as completed", result));
    }

    @PostMapping("/{lessonId}/uncomplete")
    public ResponseEntity<ApiResponse<LessonProgress>> markUncompleted(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String lessonId) {

        LessonProgress result = service.markLessonUncompleted(userId, lessonId);
        return ResponseEntity.ok(ApiResponse.success(200, "Lesson uncompleted", result));
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<ApiResponse<List<LessonProgress>>> getUserCourseProgress(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String courseId) {

        List<LessonProgress> list = service.getUserCourseProgress(userId, courseId);
        return ResponseEntity.ok(ApiResponse.success(200, "Course progress fetched", list));
    }
}