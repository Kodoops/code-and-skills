package com.codeandskills.catalog_service.infrastructure.web.dto;

public record TagRequest (
         String title,
         String slug,
         String color
) {
}
