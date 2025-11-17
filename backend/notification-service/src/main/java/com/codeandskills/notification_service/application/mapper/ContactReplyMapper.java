package com.codeandskills.notification_service.application.mapper;

import com.codeandskills.notification_service.application.dto.ContactReplyDTO;
import com.codeandskills.notification_service.domain.model.ContactMessage;
import com.codeandskills.notification_service.domain.model.ContactReply;
import org.springframework.stereotype.Component;

@Component
public class ContactReplyMapper {

    public ContactReplyDTO toDto(ContactReply entity) {
        if (entity == null) return null;

        ContactReplyDTO dto = new ContactReplyDTO();
        dto.setId(entity.getId());
        dto.setAdminId(entity.getAdminId());
        dto.setResponse(entity.getResponse());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        if (entity.getContactMessage() != null) {
            dto.setContactMessageId(entity.getContactMessage().getId());
        }

        return dto;
    }

    /**
     * ⚠️ Ici on ne gère pas l'association au ContactMessage.
     * On laisse le service lier l'entité reply à un ContactMessage existant.
     */
    public ContactReply toEntity(ContactReplyDTO dto) {
        if (dto == null) return null;

        ContactReply entity = new ContactReply();
        entity.setId(dto.getId());
        entity.setAdminId(dto.getAdminId());
        entity.setResponse(dto.getResponse());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());

        return entity;
    }

    /**
     * Variante pratique si tu as déjà le ContactMessage parent en main.
     */
    public ContactReply toEntity(ContactReplyDTO dto, ContactMessage parent) {
        ContactReply entity = toEntity(dto);
        if (entity != null) {
            entity.setContactMessage(parent);
        }
        return entity;
    }
}