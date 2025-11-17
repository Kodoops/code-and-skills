package com.codeandskills.notification_service.infrastructure.web.controller;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.notification_service.application.dto.NewsletterDTO;
import com.codeandskills.notification_service.application.service.NewsLetterService;
import com.codeandskills.notification_service.infrastructure.web.dto.newsletter.NewsletterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications/newsletter")
public class NewsLetterController {

    private final NewsLetterService newsLetterService;

    public NewsLetterController(NewsLetterService newsLetterService) {
        this.newsLetterService = newsLetterService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<NewsletterDTO>> subscribe(
            @RequestBody NewsletterRequest request
    ) {

        NewsletterDTO newsletter = newsLetterService.subscribe(request.email, request.name);
        return ResponseEntity.ok(ApiResponse.success(201, "Newsletter subscription created successfully", newsletter));
    }

    @PutMapping("/confirm")
    public ResponseEntity<ApiResponse<NewsletterDTO>> confirm(
            @RequestBody NewsletterRequest request
    ) {

        NewsletterDTO newsletter = newsLetterService.confirm(request.email);
        return ResponseEntity.ok(ApiResponse.success(201, "Newsletter subscription confirmed successfully", newsletter));
    }
}
