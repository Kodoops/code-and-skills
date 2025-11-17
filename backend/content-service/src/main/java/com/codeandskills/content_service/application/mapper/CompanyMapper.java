package com.codeandskills.content_service.application.mapper;

import com.codeandskills.content_service.application.dto.CompanyDTO;
import com.codeandskills.content_service.application.dto.CompanySocialLinkDTO;
import com.codeandskills.content_service.domain.model.Company;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CompanyMapper {

    private final CompanySocialLinkMapper companySocialLinkMapper;

    public CompanyMapper(CompanySocialLinkMapper companySocialLinkMapper) {
        this.companySocialLinkMapper = companySocialLinkMapper;
    }

    public CompanyDTO toDto(Company entity) {
        if (entity == null) return null;

        CompanyDTO dto = new CompanyDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setAddress(entity.getAddress());
        dto.setPostalCode(entity.getPostalCode());
        dto.setCity(entity.getCity());
        dto.setCountry(entity.getCountry());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setSiret(entity.getSiret());
        dto.setVatNumber(entity.getVatNumber());
        dto.setLogoUrl(entity.getLogoUrl());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        // map des liens sociaux
        if (entity.getCompanySocialLinks() != null) {
            List<CompanySocialLinkDTO> links = entity.getCompanySocialLinks()
                    .stream()
                    .map(companySocialLinkMapper::toDto)
                    .toList();
            dto.setSocialLinks(links);
        }

        return dto;
    }

    public Company toEntity(CompanyDTO dto) {
        if (dto == null) return null;

        Company entity = new Company();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setAddress(dto.getAddress());
        entity.setPostalCode(dto.getPostalCode());
        entity.setCity(dto.getCity());
        entity.setCountry(dto.getCountry());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setSiret(dto.getSiret());
        entity.setVatNumber(dto.getVatNumber());
        entity.setLogoUrl(dto.getLogoUrl());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        // pas de socialLinks ici (géré à part)
        return entity;
    }

    public void updateEntityFromDto(CompanyDTO dto, Company entity) {
        if (dto == null || entity == null) return;

        entity.setName(dto.getName());
        entity.setAddress(dto.getAddress());
        entity.setPostalCode(dto.getPostalCode());
        entity.setCity(dto.getCity());
        entity.setCountry(dto.getCountry());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setSiret(dto.getSiret());
        entity.setVatNumber(dto.getVatNumber());
        entity.setLogoUrl(dto.getLogoUrl());
    }
}