package com.codeandskills.catalog_service.infrastructure.web.dto;

public record DomainRequest(
        String title,
        String description,
        String slug,
        String color,
        String iconName,
        String iconLib
        ) {
}
