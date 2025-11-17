package com.codeandskills.notification_service.application.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ContactMessageDTO {

    private String id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private String status;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<ContactReplyDTO> replies;
}