package com.codeandskills.file_service.application.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ListFilesResponse {
    private List<FileInfoDTO> files;
    private String nextContinuationToken; // pour récupérer la page suivante
}