package com.codeandskills.catalog_service.infrastructure.web.controller.admin;

import com.codeandskills.catalog_service.application.dto.LessonDTO;
import com.codeandskills.catalog_service.application.service.LessonService;
import com.codeandskills.catalog_service.infrastructure.web.dto.LessonRequest;
import com.codeandskills.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalog/admin/lessons")
@RequiredArgsConstructor
public class AdminLessonController {

    private final LessonService service;

    /**
     * 🔹 Lire une lesson by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonDTO>> getLessonById(@PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lesson got successfully", service.getLessonById(id))
        );
    }


    /**
     * 🔹 Liste les leçons d’un chapitre
     */
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<ApiResponse<List<LessonDTO>>> getLessonsByChapter(@PathVariable String chapterId) {
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lessons fetched successfully", service.getLessonsByChapter(chapterId))
        );
    }

    /**
     * 🔹 Crée une leçon dans un chapitre
     */
    @PostMapping("/chapter/{chapterId}")
    public ResponseEntity<ApiResponse<LessonDTO>> createLesson(@PathVariable String chapterId, @RequestBody LessonRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(201, "Lesson created successfully", service.createLesson(chapterId, request))
        );
    }

    /**
     * 🔹 Met à jour une leçon
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonDTO>> updateLesson(@PathVariable String id, @RequestBody LessonRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lesson updated successfully", service.updateLesson(id, request))
        );
    }

    /**
     * 🔹 Supprime une leçon
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable String id) {
        service.deleteLesson(id);
        return ResponseEntity.ok(
                ApiResponse.success(200,"Lesson deleted successfully", null)
        );
    }
}