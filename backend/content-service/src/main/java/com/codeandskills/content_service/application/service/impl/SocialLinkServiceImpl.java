package com.codeandskills.content_service.application.service.impl;

import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.content_service.application.dto.FeatureDTO;
import com.codeandskills.content_service.application.dto.SocialLinkDTO;
import com.codeandskills.content_service.application.mapper.SocialLinkMapper;
import com.codeandskills.content_service.application.service.SocialLinkService;
import com.codeandskills.content_service.domain.model.Feature;
import com.codeandskills.content_service.domain.model.SocialLink;
import com.codeandskills.content_service.domain.repository.SocialLinkRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SocialLinkServiceImpl implements SocialLinkService {

    private final SocialLinkRepository socialLinkRepository;
    private final SocialLinkMapper socialLinkMapper;

    public SocialLinkServiceImpl(SocialLinkRepository socialLinkRepository,
                                 SocialLinkMapper socialLinkMapper) {
        this.socialLinkRepository = socialLinkRepository;
        this.socialLinkMapper = socialLinkMapper;
    }

    @Override
    public SocialLinkDTO create(SocialLinkDTO dto) {
        SocialLink entity = socialLinkMapper.toEntity(dto);
        SocialLink saved = socialLinkRepository.save(entity);
        return socialLinkMapper.toDto(saved);
    }

    @Override
    public SocialLinkDTO update(String id, SocialLinkDTO dto) {
        SocialLink existing = socialLinkRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("SocialLink not found with id: " + id));

        socialLinkMapper.updateEntityFromDto(dto, existing);
        SocialLink saved = socialLinkRepository.save(existing);
        return socialLinkMapper.toDto(saved);
    }

    @Override
    public void delete(String id) {
        socialLinkRepository.deleteById(id);
    }

    @Override
    public Optional<SocialLinkDTO> getById(String id) {
        return socialLinkRepository.findById(id)
                .map(socialLinkMapper::toDto);
    }

    @Override
    public List<SocialLinkDTO> getAll() {
        return socialLinkRepository.findAll()
                .stream()
                .map(socialLinkMapper::toDto)
                .toList();
    }

    @Override
    public PagedResponse<SocialLinkDTO> getAllPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SocialLink> features = socialLinkRepository.findAll(pageable);

        List<SocialLinkDTO> dtos = features.getContent()
                .stream()
                .map(socialLinkMapper::toDto)
                .toList();

        return new PagedResponse<>(
                dtos,
                page,
                features.getTotalPages(),
                size,
                features.getTotalElements()
        );
    }
}