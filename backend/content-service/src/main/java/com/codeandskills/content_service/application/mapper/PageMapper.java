package com.codeandskills.content_service.application.mapper;

import com.codeandskills.content_service.application.dto.PageDTO;
import com.codeandskills.content_service.domain.model.Page;
import org.springframework.stereotype.Component;

@Component
public class PageMapper {

    public PageDTO toDto(Page entity) {
        if (entity == null) return null;

        PageDTO dto = new PageDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setSlug(entity.getSlug());
        dto.setContent(entity.getContent());
        dto.setType(entity.getType());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public Page toEntity(PageDTO dto) {
        if (dto == null) return null;

        Page entity = new Page();
        entity.setId(dto.getId());
        entity.setTitle(dto.getTitle());
        entity.setSlug(dto.getSlug());
        entity.setContent(dto.getContent());
        entity.setType(dto.getType());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        return entity;
    }

    public void updateEntityFromDto(PageDTO dto, Page entity) {
        if (dto == null || entity == null) return;

        entity.setTitle(dto.getTitle());
        entity.setSlug(dto.getSlug());
        entity.setContent(dto.getContent());
        entity.setType(dto.getType());
    }
}