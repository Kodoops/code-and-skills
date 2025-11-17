package com.codeandskills.content_service.application.service;

import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.content_service.application.dto.PageDTO;

import java.util.List;
import java.util.Optional;

public interface PageService {

    PageDTO create(PageDTO dto);

    PageDTO update(String id, PageDTO dto);

    void delete(String id);

    Optional<PageDTO> getById(String id);

    Optional<PageDTO> getBySlug(String slug);

    List<PageDTO> getAll();

    PagedResponse<PageDTO> getAllPaged(int page, int size);

}