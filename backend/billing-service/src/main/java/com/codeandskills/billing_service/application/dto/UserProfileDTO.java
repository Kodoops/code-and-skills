package com.codeandskills.billing_service.application.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private String id;
    private String firstname;
    private String lastname;
    private String email;
    private String avatarUrl;
    private String bio;
    private String StripeCustomerId;
}