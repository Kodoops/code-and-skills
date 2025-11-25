package com.codeandskills.user_profile_service.infrastructure.web.dto;

import lombok.Data;

@Data
public class ProfileStatsResponse {

    private int usersCount;
    private int premiumUsersCount;

}
