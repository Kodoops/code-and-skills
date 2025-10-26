package com.codeandskills.auth_service.infractructure.web.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String firstname;
    private String lastname;
//    private String phone;
}
