package com.codeandskills.billing_service.infrastructure.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InternalFileUploadRequest {
    private String fileName;
    private String folder;
    private String contentType;
    private String base64Content;
}
