package com.codeandskills.content_service.application.service.impl;

import com.codeandskills.content_service.application.dto.CompanyDTO;
import com.codeandskills.content_service.application.dto.CompanySocialLinkDTO;
import com.codeandskills.content_service.application.mapper.CompanyMapper;
import com.codeandskills.content_service.application.mapper.CompanySocialLinkMapper;
import com.codeandskills.content_service.application.service.CompanyService;
import com.codeandskills.content_service.domain.model.Company;
import com.codeandskills.content_service.domain.model.CompanySocialLink;
import com.codeandskills.content_service.domain.repository.CompanyRepository;
import com.codeandskills.content_service.domain.repository.CompanySocialLinkRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanySocialLinkRepository companySocialLinkRepository;
    private final CompanyMapper companyMapper;
    private final CompanySocialLinkMapper companySocialLinkMapper;

    public CompanyServiceImpl(CompanyRepository companyRepository,
                              CompanySocialLinkRepository companySocialLinkRepository,
                              CompanyMapper companyMapper,
                              CompanySocialLinkMapper companySocialLinkMapper) {
        this.companyRepository = companyRepository;
        this.companySocialLinkRepository = companySocialLinkRepository;
        this.companyMapper = companyMapper;
        this.companySocialLinkMapper = companySocialLinkMapper;
    }

    @Override
    public CompanyDTO create(CompanyDTO dto) {
        Company entity = companyMapper.toEntity(dto);
        Company saved = companyRepository.save(entity);
        return companyMapper.toDto(saved);
    }

    @Override
    public CompanyDTO update(CompanyDTO dto) {
        List<Company> all = companyRepository.findAll();
        if(all.isEmpty()) {
            throw new IllegalArgumentException("Company not found ");
        }
        Company existing = all.get(0);

        companyMapper.updateEntityFromDto(dto, existing);
        Company saved = companyRepository.save(existing);
        return companyMapper.toDto(saved);
    }

    @Override
    public void delete(String id) {
        companyRepository.deleteById(id);
    }

    @Override
    public Optional<CompanyDTO> getById(String id) {
        return companyRepository.findById(id)
                .map(companyMapper::toDto);
    }

    @Override
    public List<CompanyDTO> getAll() {
        return companyRepository.findAll()
                .stream()
                .map(companyMapper::toDto)
                .toList();
    }

    @Override
    public CompanyDTO addSocialLink(String companyId, CompanySocialLinkDTO linkDto) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with id: " + companyId));

        CompanySocialLink link = companySocialLinkMapper.toEntity(linkDto);
        link.setCompany(company);
        CompanySocialLink savedLink = companySocialLinkRepository.save(link);

        // éventuellement recharger la company avec ses liens
        Company updated = companyRepository.findById(companyId)
                .orElseThrow(); // ne devrait pas arriver

        return companyMapper.toDto(updated);
    }

    @Override
    public CompanyDTO removeSocialLink(String companyId, String companySocialLinkId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with id: " + companyId));

        companySocialLinkRepository.deleteById(companySocialLinkId);

        Company updated = companyRepository.findById(companyId)
                .orElseThrow();

        return companyMapper.toDto(updated);
    }
}