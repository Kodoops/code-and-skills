package com.codeandskills.billing_service.infrastructure.client;

import com.codeandskills.billing_service.infrastructure.dto.FileUploadResponse;
import com.codeandskills.billing_service.infrastructure.dto.InternalFileUploadRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// name = nom de service Eureka, ou juste un nom logique
@FeignClient(
        name = "file-service",
        url = "${services.file-service.url}",
        configuration = FeignClientConfig.class
)
public interface FileServiceClient {

    @PostMapping("/files/internal/upload-invoice")
    FileUploadResponse uploadInvoice(@RequestBody InternalFileUploadRequest request);
}