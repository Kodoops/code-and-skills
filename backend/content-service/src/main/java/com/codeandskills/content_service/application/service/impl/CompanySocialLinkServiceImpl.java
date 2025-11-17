package com.codeandskills.content_service.application.service.impl;

import com.codeandskills.content_service.application.dto.CompanySocialLinkDTO;
import com.codeandskills.content_service.application.dto.SocialLinkDTO;
import com.codeandskills.content_service.application.mapper.CompanySocialLinkMapper;
import com.codeandskills.content_service.application.mapper.SocialLinkMapper;
import com.codeandskills.content_service.application.service.CompanySocialLinkService;
import com.codeandskills.content_service.domain.model.Company;
import com.codeandskills.content_service.domain.model.CompanySocialLink;
import com.codeandskills.content_service.domain.model.SocialLink;
import com.codeandskills.content_service.domain.repository.CompanyRepository;
import com.codeandskills.content_service.domain.repository.CompanySocialLinkRepository;
import com.codeandskills.content_service.domain.repository.SocialLinkRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class CompanySocialLinkServiceImpl implements CompanySocialLinkService {

    private final CompanySocialLinkRepository companySocialLinkRepository;
    private final CompanyRepository companyRepository;
    private final CompanySocialLinkMapper companySocialLinkMapper;
    private final SocialLinkRepository socialLinkRepository;
    private final SocialLinkMapper socialLinkMapper;

    public CompanySocialLinkServiceImpl(CompanySocialLinkRepository companySocialLinkRepository,
                                        CompanyRepository companyRepository,
                                        CompanySocialLinkMapper companySocialLinkMapper, SocialLinkRepository socialLinkRepository, SocialLinkMapper socialLinkMapper) {
        this.companySocialLinkRepository = companySocialLinkRepository;
        this.companyRepository = companyRepository;
        this.companySocialLinkMapper = companySocialLinkMapper;
        this.socialLinkRepository = socialLinkRepository;
        this.socialLinkMapper = socialLinkMapper;
    }

    @Override
    public List<CompanySocialLinkDTO> getSocialLinksByCompanyId(String companyId) {
        companyRepository.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found: " + companyId));

        List<CompanySocialLink> links = companySocialLinkRepository.findByCompanyId(companyId);
        return links.stream()
                .map(companySocialLinkMapper::toDto)
                .toList();
    }

    @Override
    public List<SocialLinkDTO> getUnlinkedSocialLinks(String companyId) {
        companyRepository.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found: " + companyId));

        List<SocialLink> available = socialLinkRepository.findSocialLinksNotLinkedToCompany(companyId);
        return available.stream()
                .map(socialLinkMapper::toDto)
                .toList();
    }

    @Transactional
    @Override
    public CompanySocialLinkDTO attachSocialLinkToCompany(String companyId, String socialLinkId, String url) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found: " + companyId));

        SocialLink socialLink = socialLinkRepository.findById(socialLinkId)
                .orElseThrow(() -> new EntityNotFoundException("SocialLink not found: " + socialLinkId));

        // éviter les doublons
        if (companySocialLinkRepository.existsByCompanyIdAndSocialLinkId(companyId, socialLinkId)) {
            throw new IllegalStateException("SocialLink déjà attaché à cette company");
        }

        CompanySocialLink link = CompanySocialLink.builder()
                .company(company)
                .socialLink(socialLink)
                .url(url)
                .build();

        CompanySocialLink saved = companySocialLinkRepository.save(link);
        return companySocialLinkMapper.toDto(saved);
    }

    @Transactional
    @Override
    public void detachSocialLinkFromCompany(String companyId, String socialLinkId) {
        boolean exists = companySocialLinkRepository
                .existsByCompanyIdAndSocialLinkId(companyId, socialLinkId);

        if (!exists) {
            throw new EntityNotFoundException("SocialLink non attaché à cette company");
        }
        log.info("SocialLink {} exists ", exists);
        companySocialLinkRepository.deleteByCompanyIdAndSocialLinkId(companyId, socialLinkId);
        log.info("SocialLink {} detached from company {}", socialLinkId, companyId);
    }
}
