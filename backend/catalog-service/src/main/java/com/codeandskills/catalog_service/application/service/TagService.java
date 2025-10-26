package com.codeandskills.catalog_service.application.service;

import com.codeandskills.catalog_service.application.dto.TagDTO;
import com.codeandskills.catalog_service.application.mapper.TagMapper;
import com.codeandskills.catalog_service.domain.model.Tag;
import com.codeandskills.catalog_service.domain.repository.TagRepository;
import com.codeandskills.catalog_service.infrastructure.web.dto.TagRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository repository;
    private final TagMapper mapper;

    public List<TagDTO> getAll() {
        return mapper.toDtoList(repository.findAll());
    }

    public TagDTO getById(String id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
    }

    public TagDTO create(TagRequest request) {
        Tag entity = new Tag(
                request.title(),
                request.slug().toLowerCase(),
                request.color(),
                null
        );
        return mapper.toDto(repository.save(entity));
    }

    public TagDTO update(String id, TagRequest request) {
        Tag existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        existing.setTitle(request.title());
        existing.setSlug(request.slug().toLowerCase());
        existing.setColor(request.color());
        return mapper.toDto(repository.save(existing));
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public Page<Tag> findAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return repository.findAll(pageable);
    }
}