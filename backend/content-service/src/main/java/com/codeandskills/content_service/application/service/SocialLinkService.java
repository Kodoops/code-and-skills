package com.codeandskills.content_service.application.service;

import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.content_service.application.dto.SocialLinkDTO;

import java.util.List;
import java.util.Optional;

public interface SocialLinkService {

    SocialLinkDTO create(SocialLinkDTO dto);

    SocialLinkDTO update(String id, SocialLinkDTO dto);

    void delete(String id);

    Optional<SocialLinkDTO> getById(String id);

    List<SocialLinkDTO> getAll();

    PagedResponse<SocialLinkDTO> getAllPaged(int page, int size);
}