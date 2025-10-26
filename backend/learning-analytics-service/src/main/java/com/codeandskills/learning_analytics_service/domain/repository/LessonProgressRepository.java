package com.codeandskills.learning_analytics_service.domain.repository;


import com.codeandskills.learning_analytics_service.domain.model.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, String> {

    List<LessonProgress> findByUserIdAndCourseId(String userId, String courseId);

    Optional<LessonProgress> findByUserIdAndLessonId(String userId, String lessonId);
}