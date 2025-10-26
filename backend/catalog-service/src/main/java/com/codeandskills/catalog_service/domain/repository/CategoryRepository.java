package com.codeandskills.catalog_service.domain.repository;

import com.codeandskills.catalog_service.domain.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.codeandskills.catalog_service.domain.model.Category;
import com.codeandskills.catalog_service.domain.model.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, String> {
    Page<Category> findByDomain(Domain domain, Pageable pageable);
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);

    @Query("""
        SELECT c
        FROM Category c
        LEFT JOIN c.courses courses
        GROUP BY c.id
        ORDER BY COUNT(courses) DESC
    """)
    List<Category> findMostPopulatedCategories(org.springframework.data.domain.Pageable pageable);
}