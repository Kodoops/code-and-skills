package com.codeandskills.file_service.infrastructure.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

// request pour presign
public record PresignUploadRequest(

        @NotBlank(message = "fileName is required")
        String fileName,

        @NotBlank(message = "folder is required")
        String folder,

        @NotBlank(message = "contentType is required")
        String contentType,

        @Positive(message = "size must be > 0")
        long size,

        boolean isImage,

        boolean isVideo,

        @NotBlank(message = "fileType is required")
        String fileType // ex: "AVATAR", "COURSE_THUMBNAIL", "RESOURCE"
) {
}
