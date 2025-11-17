package com.codeandskills.file_service.infrastructure.web.controller.admin;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.file_service.application.dto.ListFilesResponse;
import com.codeandskills.file_service.application.service.FileStorageService;
import com.codeandskills.file_service.infrastructure.web.dto.DeleteFileRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/files/admin")
@RequiredArgsConstructor
public class AdminFileController {

    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<ApiResponse<ListFilesResponse>> listFiles(
            @RequestParam(value = "prefix", required = false) String prefix,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "continuationToken", required = false) String continuationToken
    ) {
        ListFilesResponse result = fileStorageService.listFiles(prefix, limit, continuationToken);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Files listed successfully", result)
        );
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteFile(
            @RequestBody DeleteFileRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {

        fileStorageService.deleteFile(request.key());
        return ResponseEntity.ok(ApiResponse.success(200, "File deleted successfully", null));
    }
}