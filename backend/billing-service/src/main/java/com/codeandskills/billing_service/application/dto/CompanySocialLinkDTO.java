package com.codeandskills.billing_service.application.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CompanySocialLinkDTO {
    private String id;
    private String companyId;
    private String socialLinkId;
    private String url;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private SocialLinkDTO socialLink; // optionnel (peut être null)
}