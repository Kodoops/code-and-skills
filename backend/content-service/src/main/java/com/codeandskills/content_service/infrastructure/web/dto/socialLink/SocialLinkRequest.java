package com.codeandskills.content_service.infrastructure.web.dto.socialLink;

import lombok.Data;

@Data
public class SocialLinkRequest {
    private String name;
    private String iconLib;
    private String iconName;
}
