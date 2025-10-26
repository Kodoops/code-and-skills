package com.codeandskills.auth_service.infractructure.web.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    String email;
    String username;
    String  role;
    boolean enabled;
}
