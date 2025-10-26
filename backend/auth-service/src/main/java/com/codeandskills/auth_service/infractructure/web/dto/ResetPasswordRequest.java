package com.codeandskills.auth_service.infractructure.web.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String newPassword;
}
