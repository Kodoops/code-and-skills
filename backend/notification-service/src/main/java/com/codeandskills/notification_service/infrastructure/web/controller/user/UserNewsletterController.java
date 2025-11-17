package com.codeandskills.notification_service.infrastructure.web.controller.user;


import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.notification_service.application.dto.NewsletterDTO;
import com.codeandskills.notification_service.application.service.NewsLetterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/notifications/newsletter/user")
@RequiredArgsConstructor
public class UserNewsletterController {

    private final NewsLetterService newsLetterService;

    @GetMapping("/{email}")
    public ResponseEntity<ApiResponse<NewsletterDTO>> getNewsletter(
            @PathVariable String email
    ) {

        NewsletterDTO newsletter = newsLetterService.getByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(201, "Newsletter subscription fetched successfully", newsletter));
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<ApiResponse<NewsletterDTO>> deleteNewsletter(
            @PathVariable String email
    ) {

        newsLetterService.deleteByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(201, "Newsletter subscription removed successfully", null));
    }
}
