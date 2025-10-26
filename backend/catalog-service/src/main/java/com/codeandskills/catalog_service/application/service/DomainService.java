package com.codeandskills.catalog_service.application.service;

import com.codeandskills.catalog_service.domain.model.Domain;
import com.codeandskills.catalog_service.domain.repository.DomainRepository;
import com.codeandskills.catalog_service.infrastructure.web.dto.DomainRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DomainService {

    private final DomainRepository repository;

    public List<Domain> findAll() {
        return repository.findAll();
    }

    public Page<Domain> findAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return repository.findAll(pageable);
    }

    public Domain findBySlug(String slug) {
        return repository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Domain not found"));
    }

    public Domain create(DomainRequest request) {
        if (repository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Slug already exists");
        }
        Domain domain = new Domain(
                request.title(),
                request.slug(),
                request.description(),
                request.color(),
                request.iconName(),
                request.iconLib(),
                null
        );
        return repository.save(domain);
    }

    public Domain update(String id, DomainRequest updated) {
        Domain existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Domain not found"));

        existing.setTitle(updated.title());
        existing.setDescription(updated.description());
        existing.setSlug(updated.slug());
        existing.setColor(updated.color());
        existing.setIconName(updated.iconName());
        existing.setIconLib(updated.iconLib());

        return repository.save(existing);
    }

    @Transactional
    public void delete(String id) {
        repository.findById(id)
                .ifPresentOrElse(
                        repository::delete,
                        () -> { throw new IllegalArgumentException("Domain not found !"); }
                );
    }

    public Optional<Domain> findById(String domainId) {
        return repository.findById(domainId);
    }


}