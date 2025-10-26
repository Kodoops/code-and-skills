package com.codeandskills.catalog_service.application.dto;

import lombok.Data;

@Data
public class DomainDTO {
    private String id;
    private String title;
    private String description;
    private String slug;

    private String color;
    private String iconName;
    private String iconLib;
}