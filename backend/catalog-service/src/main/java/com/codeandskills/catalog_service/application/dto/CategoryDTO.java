package com.codeandskills.catalog_service.application.dto;

import lombok.Data;

@Data
public class CategoryDTO {
    private String id;
    private String title;
    private String description;
    private String slug;

    private String color;
    private String iconName;
    private String iconLib;

    // On expose le lien vers le domaine sans tout imbriquer
    private String domainId;
    private String domainTitle;
    private String domainSlug;
    private String domainDescription;

}