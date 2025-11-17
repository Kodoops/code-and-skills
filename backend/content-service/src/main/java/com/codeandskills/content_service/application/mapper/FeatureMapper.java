package com.codeandskills.content_service.application.mapper;

import com.codeandskills.content_service.application.dto.FeatureDTO;
import com.codeandskills.content_service.domain.model.Feature;
import org.springframework.stereotype.Component;

@Component
public class FeatureMapper {

    public FeatureDTO toDto(Feature entity) {
        if (entity == null) return null;

        FeatureDTO dto = new FeatureDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDesc(entity.getDesc());
        dto.setColor(entity.getColor());
        dto.setIconName(entity.getIconName());
        dto.setIconLib(entity.getIconLib());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public Feature toEntity(FeatureDTO dto) {
        if (dto == null) return null;

        Feature entity = new Feature();
        entity.setId(dto.getId());
        entity.setTitle(dto.getTitle());
        entity.setDesc(dto.getDesc());
        entity.setColor(dto.getColor());
        entity.setIconName(dto.getIconName());
        entity.setIconLib(dto.getIconLib());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        return entity;
    }

    public void updateEntityFromDto(FeatureDTO dto, Feature entity) {
        if (dto == null || entity == null) return;

        entity.setTitle(dto.getTitle());
        entity.setDesc(dto.getDesc());
        entity.setColor(dto.getColor());
        entity.setIconName(dto.getIconName());
        entity.setIconLib(dto.getIconLib());
        // createdAt on ne touche pas ici
    }
}