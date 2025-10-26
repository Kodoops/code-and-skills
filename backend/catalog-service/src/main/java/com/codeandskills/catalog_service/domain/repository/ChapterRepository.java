package com.codeandskills.catalog_service.domain.repository;

import com.codeandskills.catalog_service.domain.model.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, String> {
    List<Chapter> findByCourseId(String courseId);
    List<Chapter> findByCourseIdOrderByPositionAsc(String courseId);

    boolean existsByCourseIdAndTitleIgnoreCase(String courseId, String title);
}
