package com.codeandskills.user_profile_service.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private String id;
    private String firstname;
    private String lastname;
    private String email;
    private String avatarUrl;
    private String bio;
    private String country;
    private String city;
    private boolean isPremium;
    private String stripeCustomerId;
    private String lastLoginAt;
    private String userId;

}