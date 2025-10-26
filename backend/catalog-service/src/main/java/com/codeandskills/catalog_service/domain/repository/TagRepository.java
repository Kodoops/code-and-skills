package com.codeandskills.catalog_service.domain.repository;

import com.codeandskills.catalog_service.domain.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, String> {
    Optional<Tag> findBySlug(String slug);
}