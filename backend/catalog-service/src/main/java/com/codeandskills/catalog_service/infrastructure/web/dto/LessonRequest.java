package com.codeandskills.catalog_service.infrastructure.web.dto;

public record LessonRequest(
        String title,
        String description,
        String thumbnailKey,
        String videoKey,
        Integer duration,
        Integer position,
        Boolean publicAccess
) {}