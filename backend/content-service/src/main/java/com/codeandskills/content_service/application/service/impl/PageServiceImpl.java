package com.codeandskills.content_service.application.service.impl;

import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.content_service.application.dto.PageDTO;
import com.codeandskills.content_service.application.mapper.PageMapper;
import com.codeandskills.content_service.application.service.PageService;
import com.codeandskills.content_service.domain.model.Page;
import com.codeandskills.content_service.domain.repository.PageRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PageServiceImpl implements PageService {

    private final PageRepository pageRepository;
    private final PageMapper pageMapper;

    public PageServiceImpl(PageRepository pageRepository,
                           PageMapper pageMapper) {
        this.pageRepository = pageRepository;
        this.pageMapper = pageMapper;
    }

    @Override
    public PageDTO create(PageDTO dto) {
        Page entity = pageMapper.toEntity(dto);
        Page saved = pageRepository.save(entity);
        return pageMapper.toDto(saved);
    }

    @Override
    public PageDTO update(String id, PageDTO dto) {
        Page existing = pageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Page not found with id: " + id));

        pageMapper.updateEntityFromDto(dto, existing);
        Page saved = pageRepository.save(existing);
        return pageMapper.toDto(saved);
    }

    @Override
    public void delete(String id) {
        pageRepository.deleteById(id);
    }

    @Override
    public Optional<PageDTO> getById(String id) {
        Optional<Page> page =  pageRepository.findById(id);
        if (page.isEmpty()){
            throw new IllegalArgumentException("Page not found ");
        }
         return page.map(pageMapper::toDto);
    }

    @Override
    public Optional<PageDTO> getBySlug(String slug) {
        Optional<Page> page = pageRepository.findBySlug(slug);

        if (page.isEmpty()){
            throw new IllegalArgumentException("Page not found ");
        }
        return page.map(pageMapper::toDto);
    }

    @Override
    public PagedResponse<PageDTO> getAll(int page, int size, String type) {

        Pageable pageable = PageRequest.of(page, size);
        org.springframework.data.domain.Page<Page> pages = null;
        if(type == null) {
             pages = pageRepository.findAll(pageable);
        }else
         pages = pageRepository.findByType(type, pageable);

        List<PageDTO> dtos = pages.getContent()
                .stream()
                .map(pageMapper::toDto)
                .toList();

        return new PagedResponse<>(
                dtos,
                page,
                pages.getTotalPages(),
                size,
                pages.getTotalElements()
        );
    }

    @Override
    public PagedResponse<PageDTO> getAllPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        org.springframework.data.domain.Page<Page> features = pageRepository.findAll(pageable);

        List<PageDTO> dtos = features.getContent()
                .stream()
                .map(pageMapper::toDto)
                .toList();

        return new PagedResponse<>(
                dtos,
                page,
                features.getTotalPages(),
                size,
                features.getTotalElements()
        );

    }

    @Override
    public List<PageDTO> getPagesByType(String type) {

        return pageRepository.findByType(type).stream()
                .map(pageMapper::toDto)
                .toList();
    }

    @Override
    public PageDTO getPagesBySlug(String slug) {
        Optional<Page> bySlug = pageRepository.findBySlug(slug);
        if(bySlug.isPresent()) {
            return pageMapper.toDto(bySlug.get());
        }
        throw new IllegalArgumentException("Page not found.");
    }
}