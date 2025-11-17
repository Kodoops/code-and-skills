package com.codeandskills.content_service.domain.repository;

import com.codeandskills.content_service.domain.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PageRepository extends JpaRepository<Page, String> {

    Optional<Page> findBySlug(String slug);

    Optional<Page> findByTitle(String title);

    boolean existsBySlug(String slug);

    boolean existsByTitle(String title);
}