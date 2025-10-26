package com.codeandskills.learning_analytics_service.application.service;


import com.codeandskills.learning_analytics_service.domain.model.LessonProgress;
import com.codeandskills.learning_analytics_service.domain.repository.LessonProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonProgressService {

    private final LessonProgressRepository repository;

    public LessonProgress markLessonCompleted(String userId, String courseId, String lessonId) {
        var progress = repository.findByUserIdAndLessonId(userId, lessonId)
                .orElse(LessonProgress.builder()
                        .userId(userId)
                        .lessonId(lessonId)
                        .courseId(courseId)
                        .build());

        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        return repository.save(progress);
    }

    public LessonProgress markLessonUncompleted(String userId, String lessonId) {
        var progress = repository.findByUserIdAndLessonId(userId, lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson progress not found"));
        progress.setCompleted(false);
        return repository.save(progress);
    }

    public List<LessonProgress> getUserCourseProgress(String userId, String courseId) {
        return repository.findByUserIdAndCourseId(userId, courseId);
    }
}