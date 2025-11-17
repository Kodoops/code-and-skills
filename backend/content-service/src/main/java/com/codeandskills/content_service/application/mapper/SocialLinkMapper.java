package com.codeandskills.content_service.application.mapper;

import com.codeandskills.content_service.application.dto.SocialLinkDTO;
import com.codeandskills.content_service.domain.model.SocialLink;
import org.springframework.stereotype.Component;

@Component
public class SocialLinkMapper {

    public SocialLinkDTO toDto(SocialLink entity) {
        if (entity == null) return null;

        SocialLinkDTO dto = new SocialLinkDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setIconLib(entity.getIconLib());
        dto.setIconName(entity.getIconName());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public SocialLink toEntity(SocialLinkDTO dto) {
        if (dto == null) return null;

        SocialLink entity = new SocialLink();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setIconLib(dto.getIconLib());
        entity.setIconName(dto.getIconName());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        return entity;
    }

    public void updateEntityFromDto(SocialLinkDTO dto, SocialLink entity) {
        if (dto == null || entity == null) return;

        entity.setName(dto.getName());
        entity.setIconLib(dto.getIconLib());
        entity.setIconName(dto.getIconName());
    }
}
