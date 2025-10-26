package com.codeandskills.catalog_service.infrastructure.web.dto;

public record ChapterRequest(
        String title,
        int position
) {
}
