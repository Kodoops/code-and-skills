package com.codeandskills.content_service.application.service.impl;

import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.content_service.application.dto.FeatureDTO;
import com.codeandskills.content_service.application.mapper.FeatureMapper;
import com.codeandskills.content_service.application.service.FeatureService;
import com.codeandskills.content_service.domain.model.Feature;
import com.codeandskills.content_service.domain.repository.FeatureRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FeatureServiceImpl implements FeatureService {

    private final FeatureRepository featureRepository;
    private final FeatureMapper featureMapper;

    public FeatureServiceImpl(FeatureRepository featureRepository,
                              FeatureMapper featureMapper) {
        this.featureRepository = featureRepository;
        this.featureMapper = featureMapper;
    }

    @Override
    public FeatureDTO create(FeatureDTO dto) {
        Feature feature = featureMapper.toEntity(dto);
        Feature saved = featureRepository.save(feature);
        return featureMapper.toDto(saved);
    }

    @Override
    public FeatureDTO update(String id, FeatureDTO dto) {
        Feature existing = featureRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Feature not found with id: " + id));

        featureMapper.updateEntityFromDto(dto, existing);
        Feature saved = featureRepository.save(existing);
        return featureMapper.toDto(saved);
    }

    @Override
    public void delete(String id) {
        featureRepository.deleteById(id);
    }

    @Override
    public Optional<FeatureDTO> getById(String id) {
        return featureRepository.findById(id)
                .map(featureMapper::toDto);
    }

    @Override
    public List<FeatureDTO> getAll() {
        return featureRepository.findAll()
                .stream()
                .map(featureMapper::toDto)
                .toList();
    }

    @Override
    public PagedResponse<FeatureDTO> getAllPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Feature> features = featureRepository.findAll(pageable);

        List<FeatureDTO> dtos = features.getContent()
                .stream()
                .map(featureMapper::toDto)
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
