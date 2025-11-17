package com.codeandskills.notification_service.infrastructure.web.controller.admin;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.notification_service.application.dto.ContactMessageDTO;
import com.codeandskills.notification_service.application.dto.NewsletterDTO;
import com.codeandskills.notification_service.application.service.NewsLetterService;
import com.codeandskills.notification_service.infrastructure.web.dto.newsletter.NewsletterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications/newsletter/admin")
public class AdminNewsLetterController {

    private final NewsLetterService newsLetterService;

    public AdminNewsLetterController(NewsLetterService newsLetterService) {
        this.newsLetterService = newsLetterService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<PagedResponse<NewsletterDTO>>> getAll(
            @RequestParam(name = "status",  required = false) boolean status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {


        PagedResponse<NewsletterDTO> letters = (!status)
                ? newsLetterService.getAll(page, size)
                : newsLetterService.getByStatus(status, page, size);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Newsletters  récupérées avec succès", letters)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<NewsletterDTO>> delete(@PathVariable String id) {

       newsLetterService.deleteNewsletter(id);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Newsletters supprimée avec succès", null)
        );
    }

}
