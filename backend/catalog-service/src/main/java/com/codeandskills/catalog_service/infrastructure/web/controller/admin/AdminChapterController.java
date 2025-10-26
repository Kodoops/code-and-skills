package com.codeandskills.catalog_service.infrastructure.web.controller.admin;

import com.codeandskills.catalog_service.application.dto.ChapterDTO;
import com.codeandskills.catalog_service.application.service.ChapterService;
import com.codeandskills.catalog_service.infrastructure.web.dto.ChapterRequest;
import com.codeandskills.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalog/admin/chapters")
@RequiredArgsConstructor
public class AdminChapterController {

    private final ChapterService service;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<ChapterDTO>>> getChaptersByCourse(@PathVariable String courseId) {
        return ResponseEntity.ok(
                ApiResponse.success(200, "Chapters fetched", service.getChaptersByCourse(courseId))
        );
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<ChapterDTO>> createChapter(
            @PathVariable String courseId,
            @RequestBody ChapterRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(201, "Chapter created", service.createChapter(courseId, request))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ChapterDTO>> updateChapter(@PathVariable String id, @RequestBody ChapterRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(200,"Chapter updated", service.updateChapter(id, request))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChapter(@PathVariable String id) {
        service.deleteChapter(id);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Chapter deleted", null)
        );
    }
}