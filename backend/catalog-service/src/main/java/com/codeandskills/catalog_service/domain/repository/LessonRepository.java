package com.codeandskills.catalog_service.domain.repository;

import com.codeandskills.catalog_service.domain.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, String> {
    List<Lesson> findByChapterIdOrderByPositionAsc(String chapterId);

    boolean existsByChapterIdAndTitleIgnoreCase(String chapterId, String title);
}