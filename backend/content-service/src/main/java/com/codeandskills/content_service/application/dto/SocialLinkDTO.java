package com.codeandskills.content_service.application.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SocialLinkDTO {
    private String id;
    private String name;
    private String iconLib;
    private String iconName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}