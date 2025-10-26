package com.codeandskills.auth_service.infractructure.web.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogoutRequest {
    private String refreshToken;
}