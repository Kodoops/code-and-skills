package com.codeandskills.catalog_service.infrastructure.web.controller.admin;

import com.codeandskills.catalog_service.domain.model.Lesson;
import com.codeandskills.catalog_service.domain.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/catalog/admin/chapters")
@RequiredArgsConstructor
public class LessonController {

    private final LessonRepository lessonRepository;

    @PatchMapping("/{chapterId}/lessons/reorder")
    public ResponseEntity<?> reorderLessons(
            @PathVariable String chapterId,
            @RequestBody List<Map<String, Object>> lessons
    ) {
        if (lessons == null || lessons.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid request: no lessons provided"
            ));
        }

        lessons.forEach(ls -> {
            String id = (String) ls.get("id");
            Integer position = (Integer) ls.get("position");
            Lesson lesson = lessonRepository.findById(id).orElse(null);
            if (lesson != null && lesson.getChapter().getId().equals(chapterId)) {
                lesson.setPosition(position);
                lessonRepository.save(lesson);
            }
        });

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Lessons reordered successfully"
        ));
    }
}