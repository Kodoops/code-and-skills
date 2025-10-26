package com.codeandskills.catalog_service.domain.repository;


import com.codeandskills.catalog_service.domain.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByStatus(CourseStatus status);

    Page<Course> findByStatus(CourseStatus status, Pageable pageable);

    Page<Course> findByUserId(String userId, Pageable pageable);

    Optional<Course> findBySlug(String slug);

    @EntityGraph(attributePaths = {
            "category",
            "chapters",
            "chapters.lessons",
            "tags"
    })
    @Query("""
    SELECT DISTINCT c FROM Course c
    LEFT JOIN FETCH c.chapters ch
    LEFT JOIN FETCH ch.lessons l
    WHERE c.slug = :slug
    ORDER BY ch.position ASC, l.position ASC
""")
    Optional<Course> findBySlugWithOrderedChaptersAndLessons(@Param("slug") String slug);

    List<Course> findByStatusOrderByCreatedAtDesc(CourseStatus courseStatus, PageRequest pageRequest);

    List<Course> findAllByOrderByCreatedAtDesc(PageRequest pageRequest);

    boolean existsBySlug(String slug);
    boolean existsByTitle(String title);


    @Query("""
    SELECT c FROM Course c
    WHERE c.status = 'PUBLISHED'
    AND (:categorySlug IS NULL OR c.category.slug = :categorySlug)
    AND (:levelEnum IS NULL OR c.level = :levelEnum)
    AND (
         :isFree IS NULL
         OR (:isFree = TRUE AND c.price = 0)
         OR (:isFree = FALSE AND (c.price > 0 OR c.price IS NULL))
    )
    ORDER BY c.createdAt DESC
""")
    Page<Course> findByFilters(
            @Param("categorySlug") String categorySlug,
            @Param("levelEnum") Level levelEnum,
            @Param("isFree") Boolean isFree,
            Pageable pageable
    );
}

