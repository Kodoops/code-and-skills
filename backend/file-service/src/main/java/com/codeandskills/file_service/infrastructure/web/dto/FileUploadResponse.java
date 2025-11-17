package com.codeandskills.file_service.infrastructure.web.dto;

public record FileUploadResponse(
        String key,
        String url,
        String originalFileName,
        String contentType,
        long size
) {}