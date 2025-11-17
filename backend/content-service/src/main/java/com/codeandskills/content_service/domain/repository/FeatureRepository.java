package com.codeandskills.content_service.domain.repository;


import com.codeandskills.content_service.domain.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeatureRepository extends JpaRepository<Feature, String> {

    Optional<Feature> findByTitle(String title);

    boolean existsByTitle(String title);
}