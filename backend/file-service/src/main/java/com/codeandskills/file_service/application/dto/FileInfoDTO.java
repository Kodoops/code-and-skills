package com.codeandskills.file_service.application.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class FileInfoDTO {
    private String key;          // chemin / nom du fichier dans le bucket
    private String url;          // URL publique/accessible
    private Long size;           // taille en bytes
    private Instant lastModified;
    private String etag;
}