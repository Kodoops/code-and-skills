package com.codeandskills.notification_service.infrastructure.web.dto.contact;

import lombok.Data;


@Data
public class ContactRequest {

    private String name;
    private String email;
    private String subject;
    private String message;
    private String userId;
}