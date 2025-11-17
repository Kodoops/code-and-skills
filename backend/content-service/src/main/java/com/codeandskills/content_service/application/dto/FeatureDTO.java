package com.codeandskills.content_service.application.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FeatureDTO {
    private String id;
    private String title;
    private String desc;
    private String color;
    private String iconName;
    private String iconLib;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}