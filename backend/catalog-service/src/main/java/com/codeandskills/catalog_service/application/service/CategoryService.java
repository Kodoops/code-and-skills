package com.codeandskills.catalog_service.application.service;

import com.codeandskills.catalog_service.application.dto.CategoryDTO;
import com.codeandskills.catalog_service.domain.model.Category;
import com.codeandskills.catalog_service.domain.model.Domain;
import com.codeandskills.catalog_service.domain.repository.CategoryRepository;
import com.codeandskills.catalog_service.domain.repository.DomainRepository;
import com.codeandskills.catalog_service.infrastructure.web.dto.CategoryRequest;
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
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final DomainRepository domainRepository;

    public Page<Category> findAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return categoryRepository.findAll(pageable);
    }

    public Page<Category> findByDomain(String domainSlug, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Domain domain = domainRepository.findBySlug(domainSlug)
                .orElseThrow(() -> new IllegalArgumentException("Domain not found"));

        return categoryRepository.findByDomain(domain, pageable);
    }

    public Category findBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }


    public Optional<Category> findById(String categoryId) {
        return categoryRepository.findById(categoryId);
    }

    public Category create(CategoryRequest request, Domain domain) {
        if (categoryRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Slug already exists");
        }

        Category category = new Category(
                request.title(),
                request.slug(),
                request.description(),
                request.color(),
                request.iconName(),
                request.iconLib(),
                domain,
                null
                );

        return categoryRepository.save(category);
    }

    public Category update(String id, CategoryRequest request, Domain domain) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        existing.setTitle(request.title());
        existing.setDescription(request.description());
        existing.setSlug(request.slug());
        existing.setDomain(domain);
        existing.setColor(request.color());
        existing.setIconName(request.iconName());
        existing.setIconLib(request.iconLib());

        return categoryRepository.save(existing);
    }

    @Transactional
    public void delete(String id) {
        categoryRepository.findById(id)
                .ifPresentOrElse(
                        categoryRepository::delete,
                        () -> { throw new IllegalArgumentException("Category not found !"); }
                );
    }

    public List<Category> getMostPopularCategories(int limit) {
        List<Category> result = categoryRepository.findMostPopulatedCategories(PageRequest.of(0, limit));
        return result  ;
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }
}