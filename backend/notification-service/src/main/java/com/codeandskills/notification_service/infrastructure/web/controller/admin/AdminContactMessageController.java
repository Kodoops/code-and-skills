package com.codeandskills.notification_service.infrastructure.web.controller.admin;


import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.notification_service.application.dto.ContactMessageDTO;
import com.codeandskills.notification_service.application.dto.ContactReplyDTO;
import com.codeandskills.notification_service.application.service.MailService;
import com.codeandskills.notification_service.infrastructure.web.dto.contact.ReplyRequest;
import com.codeandskills.notification_service.application.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications/contact/admin")
@RequiredArgsConstructor
public class AdminContactMessageController {

    private final ContactMessageService contactMessageService;
    private final MailService mailService;

    @Value("${app.frontendUrl}")
    private String frontendUrl;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactMessageDTO>>> getAll(
            @RequestParam(value = "status", required = false) String status
    ) {
        List<ContactMessageDTO> messages = (status == null || status.isBlank())
                ? contactMessageService.getAll()
                : contactMessageService.getByStatus(status);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Messages de contact récupérés avec succès", messages)
        );
    }

    @GetMapping("/messages")
    public ResponseEntity<ApiResponse<PagedResponse<ContactMessageDTO>>> getAll(
            @RequestParam(name = "status",  required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ContactMessageDTO> messages = (status == null || status.isBlank())
                ? contactMessageService.getAll(page, size)
                : contactMessageService.getByStatus(status, page, size);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Messages de contact récupérés avec succès", messages)
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactMessageDTO>> getById(@PathVariable String id) {
        ContactMessageDTO dto = contactMessageService.getById(id);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Message de contact récupéré avec succès", dto)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ContactMessageDTO>> updateStatus(
            @PathVariable String id,
            @RequestParam("status") String status
    ) {
        ContactMessageDTO dto = contactMessageService.updateStatus(id, status);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Statut du message mis à jour", dto)
        );
    }

    @PutMapping("/{id}/reply")
    public ResponseEntity<ApiResponse<ContactMessageDTO>> addReply(
            @PathVariable String id,
            @RequestBody ReplyRequest replyRequest
    ) {

        ContactReplyDTO replyDto = new ContactReplyDTO();
        replyDto.setAdminId(replyRequest.getAdminId());
        replyDto.setContactMessageId(replyRequest.getContactMessageId());
        replyDto.setResponse(replyRequest.getResponse());
        replyDto.setCreatedAt(LocalDateTime.now());
        replyDto.setUpdatedAt(LocalDateTime.now());

        ContactMessageDTO updated = contactMessageService.addReply(id, replyDto);

        // Send Email to User
        Map<String, Object> variables = new java.util.HashMap<>();
        variables.put("userName", updated.getName());
        variables.put("profileLink", frontendUrl + "/pages/newsletter/confirm?email=" + updated.getEmail());
        variables.put("sujet","Réponse a : " + updated.getSubject());
        variables.put("message", updated.getMessage());
        variables.put("response", replyDto.getResponse());

        mailService.sendEmail(updated.getEmail(), "Réponse a  :  "+ updated.getSubject(), "response-message", variables);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Réponse ajoutée au message", updated)
        );
    }
}