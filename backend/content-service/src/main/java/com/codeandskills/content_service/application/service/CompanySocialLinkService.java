package com.codeandskills.content_service.application.service;

import com.codeandskills.content_service.application.dto.CompanySocialLinkDTO;
import com.codeandskills.content_service.application.dto.SocialLinkDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CompanySocialLinkService {
    List<CompanySocialLinkDTO> getSocialLinksByCompanyId(String companyId);

    List<SocialLinkDTO> getUnlinkedSocialLinks(String id);

    @Transactional
    CompanySocialLinkDTO attachSocialLinkToCompany(String companyId, String socialLinkId, String url);

    @Transactional
    void detachSocialLinkFromCompany(String companyId, String socialLinkId);
}
