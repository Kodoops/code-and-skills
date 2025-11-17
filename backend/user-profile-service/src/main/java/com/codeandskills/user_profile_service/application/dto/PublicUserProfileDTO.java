package com.codeandskills.user_profile_service.application.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicUserProfileDTO {
    private String id;
    private String firstname;
    private String lastname;
    private String email;
    private String avatarUrl;
    private String title;
    private String bio;
    private String country;
    private String city;
    private String stripeCustomerId;
    private String userId;
/*    private boolean isPremium;
    private String lastLoginAt;*/

}