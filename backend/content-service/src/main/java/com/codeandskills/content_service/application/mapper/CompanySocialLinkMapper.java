package com.codeandskills.content_service.application.mapper;

import com.codeandskills.content_service.application.dto.CompanySocialLinkDTO;
import com.codeandskills.content_service.domain.model.Company;
import com.codeandskills.content_service.domain.model.CompanySocialLink;
import com.codeandskills.content_service.domain.model.SocialLink;
import org.springframework.stereotype.Component;

@Component
public class CompanySocialLinkMapper {

    private final SocialLinkMapper socialLinkMapper;

    public CompanySocialLinkMapper(SocialLinkMapper socialLinkMapper) {
        this.socialLinkMapper = socialLinkMapper;
    }

    public CompanySocialLinkDTO toDto(CompanySocialLink entity) {
        if (entity == null) return null;

        CompanySocialLinkDTO dto = new CompanySocialLinkDTO();
        dto.setId(entity.getId());
        dto.setCompanyId(entity.getCompany().getId());
        dto.setSocialLinkId(entity.getSocialLink().getId());
        dto.setUrl(entity.getUrl());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        // on hydrate aussi le SocialLink
        dto.setSocialLink(socialLinkMapper.toDto(entity.getSocialLink()));
        return dto;
    }

    public CompanySocialLink toEntity(CompanySocialLinkDTO dto) {
        if (dto == null) return null;

        CompanySocialLink entity = new CompanySocialLink();

        entity.setId(dto.getId());
        entity.setUrl(dto.getUrl());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());

        // --- relation Company ---
        if (dto.getCompanyId() != null) {
            Company company = new Company();
            company.setId(dto.getCompanyId());
            entity.setCompany(company);
        }

        // --- relation SocialLink ---
        if (dto.getSocialLinkId() != null) {
            SocialLink socialLink = new SocialLink();
            socialLink.setId(dto.getSocialLinkId());
            entity.setSocialLink(socialLink);
        }

        return entity;
    }
}