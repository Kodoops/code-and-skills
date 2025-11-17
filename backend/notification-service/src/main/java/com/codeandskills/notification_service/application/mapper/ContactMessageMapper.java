package com.codeandskills.notification_service.application.mapper;

import com.codeandskills.notification_service.application.dto.ContactMessageDTO;
import com.codeandskills.notification_service.application.dto.ContactReplyDTO;
import com.codeandskills.notification_service.domain.model.ContactMessage;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ContactMessageMapper {

    private final ContactReplyMapper replyMapper;

    public ContactMessageMapper(ContactReplyMapper replyMapper) {
        this.replyMapper = replyMapper;
    }

    public ContactMessageDTO toDto(ContactMessage entity) {
        if (entity == null) return null;

        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setSubject(entity.getSubject());
        dto.setMessage(entity.getMessage());
        dto.setStatus(entity.getStatus());
        dto.setUserId(entity.getUserId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        if (entity.getReplies() != null) {
            List<ContactReplyDTO> replies = entity.getReplies()
                    .stream()
                    .map(replyMapper::toDto)
                    .toList();
            dto.setReplies(replies);
        }

        return dto;
    }

    public ContactMessage toEntity(ContactMessageDTO dto) {
        if (dto == null) return null;

        ContactMessage entity = new ContactMessage();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setSubject(dto.getSubject());
        entity.setMessage(dto.getMessage());
        entity.setStatus(dto.getStatus());
        entity.setUserId(dto.getUserId());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());

        // On ne gère pas dto.getReplies() ici : c’est le service qui décidera quoi faire.
        return entity;
    }

    public void updateEntityFromDto(ContactMessageDTO dto, ContactMessage entity) {
        if (dto == null || entity == null) return;

        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setSubject(dto.getSubject());
        entity.setMessage(dto.getMessage());
        entity.setStatus(dto.getStatus());
        // userId normalement ne change pas
    }
}