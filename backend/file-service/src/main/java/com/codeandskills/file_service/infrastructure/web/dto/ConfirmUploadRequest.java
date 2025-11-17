package com.codeandskills.file_service.infrastructure.web.dto;


public record ConfirmUploadRequest(
        String key,
        long size,
        String contentType,
        String originalFileName
) {}