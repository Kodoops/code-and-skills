package com.codeandskills.notification_service.application.mapper;

import com.codeandskills.notification_service.application.dto.NewsletterDTO;
import com.codeandskills.notification_service.domain.model.Newsletter;
import org.springframework.stereotype.Component;

@Component
public class NewsletterMapper {

    public NewsletterDTO toDto(Newsletter entity) {
        NewsletterDTO dto = new NewsletterDTO();

        dto.setEmail(entity.getEmail());
        dto.setName(entity.getName());
        dto.setConfirmed(entity.isConfirmed());
        dto.setId(entity.getId());

        return dto;
    }

    public Newsletter toEntity(NewsletterDTO dto) {
        Newsletter entity = new Newsletter();
        entity.setId(dto.getId());
        entity.setEmail(dto.getEmail());
        entity.setName(dto.getName());
        entity.setConfirmed(dto.isConfirmed());

        return entity;
    }
}
