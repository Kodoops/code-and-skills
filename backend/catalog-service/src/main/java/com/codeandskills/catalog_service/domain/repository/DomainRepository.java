package com.codeandskills.catalog_service.domain.repository;

import com.codeandskills.catalog_service.domain.model.Domain;
import org.springframework.data.jpa.repository.JpaRepository;

import com.codeandskills.catalog_service.domain.model.Domain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DomainRepository extends JpaRepository<Domain, String> {
    Optional<Domain> findBySlug(String slug);
    boolean existsBySlug(String slug);
}