package com.codeandskills.notification_service.infrastructure.web.dto.contact;

import lombok.Data;

@Data
public class ReplyRequest {

    private String contactMessageId;
    private String adminId;
    private String response;

}
