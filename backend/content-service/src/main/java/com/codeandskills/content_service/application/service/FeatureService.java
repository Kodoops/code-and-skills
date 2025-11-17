package com.codeandskills.content_service.application.service;

import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.content_service.application.dto.FeatureDTO;

import java.util.List;
import java.util.Optional;

public interface FeatureService {

    FeatureDTO create(FeatureDTO dto);

    FeatureDTO update(String id, FeatureDTO dto);

    void delete(String id);

    Optional<FeatureDTO> getById(String id);

    List<FeatureDTO> getAll();

    PagedResponse<FeatureDTO> getAllPaged(int page, int size);
}