package com.codeandskills.content_service.infrastructure.web.dto.socialLink;

import lombok.Data;

@Data
public class AttachSocialLinkRequest {
    private String socialLinkId;
    private String url; // url spécifique de la company vers ce réseau social
}