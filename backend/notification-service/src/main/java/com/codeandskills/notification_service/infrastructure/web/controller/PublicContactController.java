package com.codeandskills.notification_service.infrastructure.web.controller;


import com.codeandskills.common.response.ApiResponse;

import com.codeandskills.notification_service.application.dto.ContactMessageDTO;
import com.codeandskills.notification_service.application.service.ContactMessageService;
import com.codeandskills.notification_service.infrastructure.web.dto.contact.ContactRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/notifications/contact")
@RequiredArgsConstructor
public class PublicContactController {

    private final ContactMessageService contactMessageService;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessageDTO>> submitContact(
            @RequestBody ContactRequest request
    ) {

        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setName(request.getName());
        dto.setEmail(request.getEmail());
        dto.setSubject(request.getSubject());
        dto.setMessage(request.getMessage());
        dto.setUserId(request.getUserId());
        dto.setCreatedAt(LocalDateTime.now());
        dto.setUpdatedAt(LocalDateTime.now());

        ContactMessageDTO saved = contactMessageService.createMessage(dto);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Message de contact envoyé avec succès", saved)
        );
    }
}