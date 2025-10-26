package com.codeandskills.catalog_service.application.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private String id;
    private String title;
    private String slug;
    private String smallDescription;
    private String description;
    private String fileKey;
    private Integer price;
    private String currency;
    private Integer duration;
    private String status;
    private String level;
    private String stripePriceId;
    private String userId;
    private UserProfileDTO user;

    private String categoryId;
    private String categoryTitle;

    private List<TagDTO> tags;
    private List<ChapterDTO> chapters;

    private List<String> objectives;
    private List<String> prerequisites;

    private List<String> resourceIds;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}