package com.codeandskills.catalog_service.domain.repository;

import com.codeandskills.catalog_service.domain.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, String> {}
