package com.codeandskills.content_service.application.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PageDTO {
    private String id;
    private String title;
    private String slug;
    private String content;
    private String type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}