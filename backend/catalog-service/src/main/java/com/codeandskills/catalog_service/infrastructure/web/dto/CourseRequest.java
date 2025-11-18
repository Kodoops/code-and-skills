package com.codeandskills.catalog_service.infrastructure.web.dto;


public record CourseRequest (
         String id,
         String title,
         String slug,
         String smallDescription,
         String description,
         String fileKey,
         int price,
         String currency,
         int duration,
         String status,
         String level,
         String stripePriceId,
         String userId,
         String categoryId
) {
}
