package com.codeandskills.file_service.infrastructure.web.controller;

import com.codeandskills.file_service.application.service.FileStorageService;
import com.codeandskills.file_service.infrastructure.web.dto.FileUploadResponse;
import com.codeandskills.file_service.infrastructure.web.dto.InternalFileUploadRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Base64;

@RestController
@RequestMapping("/files/internal")
@RequiredArgsConstructor
public class InternalFileController {

    private final FileStorageService storageService;


    @GetMapping("/download-invoice")
    public ResponseEntity<byte[]> downloadInvoice(@RequestParam("key") String key) throws IOException {
        byte[] bytes = storageService.download(key);

        return new ResponseEntity<>(bytes, HttpStatus.OK);
    }
    @PostMapping("/upload-invoice")
    public ResponseEntity<FileUploadResponse> uploadInvoice(@RequestBody InternalFileUploadRequest req) {
        byte[] content = Base64.getDecoder().decode(req.getBase64Content());

        String folder = (req.getFolder() != null && !req.getFolder().isBlank())
                ? req.getFolder()
                : "invoices";

        String key = folder + "/" + req.getFileName();

        storageService.uploadBytes(key, content, req.getContentType());

        String url = storageService.getPublicUrl(key);

        return ResponseEntity.ok(new FileUploadResponse(key, url, req.getFileName(), req.getContentType(), 0));
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> download(@RequestParam("key") String key) throws IOException {
        byte[] bytes = storageService.download(key);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(Paths.get(key).getFileName().toString())
                .build());

        return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
    }
}