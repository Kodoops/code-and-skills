package com.codeandskills.file_service.infrastructure.web.dto;

// response pour presign
public record PresignUploadResponse(
        String url,
        String key,
        long expiresInSeconds
) {}
