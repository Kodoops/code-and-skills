package com.codeandskills.catalog_service.infrastructure.web.controller.admin;

import com.codeandskills.catalog_service.domain.model.Chapter;
import com.codeandskills.catalog_service.domain.repository.ChapterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/catalog/admin/courses")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterRepository chapterRepository;

    @PatchMapping("/{courseId}/chapters/reorder")
    public ResponseEntity<?> reorderChapters(
            @PathVariable String courseId,
            @RequestBody List<Map<String, Object>> chapters
    ) {
        if (chapters == null || chapters.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid request: no chapters provided"
            ));
        }

        chapters.forEach(ch -> {
            String id = (String) ch.get("id");
            Integer position = (Integer) ch.get("position");
            Chapter chapter = chapterRepository.findById(id).orElse(null);
            if (chapter != null && chapter.getCourse().getId().equals(courseId)) {
                chapter.setPosition(position);
                chapterRepository.save(chapter);
            }
        });

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Chapters reordered successfully"
        ));
    }
}