package com.codeandskills.catalog_service.application.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDTO {
    private String id;
    private String title;
    private String description;
    private String fileKey;
    private String url;
    private String type;
}