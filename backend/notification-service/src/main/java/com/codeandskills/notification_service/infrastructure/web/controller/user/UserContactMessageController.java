package com.codeandskills.notification_service.infrastructure.web.controller.user;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.notification_service.application.dto.ContactMessageDTO;
import com.codeandskills.notification_service.application.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/notifications/contact/user")
@RequiredArgsConstructor
public class UserContactMessageController {

    private final ContactMessageService contactMessageService;

    @GetMapping("{userId}/messages")
    public ResponseEntity<ApiResponse<PagedResponse<ContactMessageDTO>>> getAll(
            @PathVariable String userId,
            @RequestParam(name = "status",  required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ContactMessageDTO> messages = (status == null || status.isBlank())
                ? contactMessageService.getByUserId(userId, page, size)
                : contactMessageService.getByStatusAndUserId(status, userId, page, size);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Messages de contact récupérés avec succès", messages)
        );
    }


    @DeleteMapping("{userId}/messages/{id}")
    public ResponseEntity<ApiResponse<PagedResponse<ContactMessageDTO>>> deleteMessageContact(
            @PathVariable String userId,
            @PathVariable String id

    ) {

        contactMessageService.deleteUserMessage(userId, id);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Messages de contact supprimé avec succès", null)
        );
    }

    @PutMapping("{userId}/messages/{id}")
    public ResponseEntity<ApiResponse<ContactMessageDTO>> archiveMessageContact(
            @PathVariable String userId,
            @PathVariable String id

    ) {

        ContactMessageDTO messageDTO = contactMessageService.archiveUserMessage(userId, id);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Messages de contact archivé avec succès", messageDTO)
        );
    }

}
