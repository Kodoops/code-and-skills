package com.codeandskills.notification_service.application.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ContactReplyDTO {

    private String id;
    private String contactMessageId;
    private String adminId;
    private String response;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}