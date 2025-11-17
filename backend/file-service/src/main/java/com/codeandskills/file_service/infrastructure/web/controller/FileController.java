package com.codeandskills.file_service.infrastructure.web.controller;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.file_service.application.service.FileStorageService;
import com.codeandskills.file_service.infrastructure.web.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/files/user")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @GetMapping("/presign-download")
    public ResponseEntity<ApiResponse<PresignDownloadResponse>> presignDownload(
            @RequestParam String key
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                200,
                "Presigned download URL generated",
                fileStorageService.createPresignedDownload(key))
        );
    }

    @PostMapping(
            path = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<FileUploadResponse>> uploadFile(
            @RequestPart("file") MultipartFile file,
            @RequestParam(required = false, defaultValue = "uploads") String folder,
            @RequestParam(required = false, defaultValue = "GENERIC") String fileType,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        FileUploadResponse response = fileStorageService.uploadFile(file, folder, fileType, userId);
        return ResponseEntity.ok(ApiResponse.success(200, "File uploaded successfully", response));
    }

    @PostMapping(
            path = "/presign-upload",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<PresignUploadResponse>> createPresignedUpload(
            @Valid @RequestBody PresignUploadRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        PresignUploadResponse response = fileStorageService.createPresignedUpload(request, userId);
        return ResponseEntity.ok(ApiResponse.success(200, "Presigned URL generated", response));
    }

    @PostMapping("/confirm-upload")
    public ResponseEntity<ApiResponse<Void>>confirmUpload(@RequestBody ConfirmUploadRequest req) {

        fileStorageService.checkFileExist(req.key());

        fileStorageService.setFileStatusUploaded(req);

        return  ResponseEntity.ok(ApiResponse.success(200, "Upload confirmed", null));
    }


    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteFile(
            @RequestBody DeleteFileRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String role
    ) {
        if(role != null && !role.equals("ADMIN")) {
            fileStorageService.deleteFile(request.key());
        }
        fileStorageService.deleteFile(request.key(), userId);
        return ResponseEntity.ok(ApiResponse.success(200, "File deleted successfully", null));
    }
}