package com.codeandskills.content_service.application.service;

import com.codeandskills.content_service.application.dto.CompanyDTO;
import com.codeandskills.content_service.application.dto.CompanySocialLinkDTO;

import java.util.List;
import java.util.Optional;

public interface CompanyService {

    CompanyDTO create(CompanyDTO dto);

    CompanyDTO update( CompanyDTO dto);

    void delete(String id);

    Optional<CompanyDTO> getById(String id);

    List<CompanyDTO> getAll();

    // 🔹 Gestion des liens sociaux
    CompanyDTO addSocialLink(String companyId, CompanySocialLinkDTO linkDto);

    CompanyDTO removeSocialLink(String companyId, String companySocialLinkId);
}