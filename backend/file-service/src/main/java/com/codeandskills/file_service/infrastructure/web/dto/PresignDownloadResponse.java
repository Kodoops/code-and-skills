package com.codeandskills.file_service.infrastructure.web.dto;


public record PresignDownloadResponse(
        String url,
        long expiresInSeconds
) {}