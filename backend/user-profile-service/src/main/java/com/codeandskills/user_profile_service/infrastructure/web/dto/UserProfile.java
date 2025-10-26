package com.codeandskills.user_profile_service.infrastructure.web.dto;

import jakarta.persistence.Id;

import java.time.LocalDateTime;

public class UserProfile {
    @Id
    private String id;

    private String firstname;
    private String lastname;
    private String avatarUrl;
    private String bio;
    private String country;
    private String city;
    private String email;
    private String userId;
    private boolean isPremium;
    private LocalDateTime lastLoginAt;

}
