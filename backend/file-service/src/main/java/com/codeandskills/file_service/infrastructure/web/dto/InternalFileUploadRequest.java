package com.codeandskills.file_service.infrastructure.web.dto;

import lombok.Data;

@Data
public class InternalFileUploadRequest {
    private String fileName;     // ex: "INV-20251119-1234.pdf"
    private String folder;       // ex: "invoices"
    private String contentType;  // "application/pdf"
    private String base64Content;
}