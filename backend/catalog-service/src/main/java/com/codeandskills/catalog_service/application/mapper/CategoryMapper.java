package com.codeandskills.catalog_service.application.mapper;

import com.codeandskills.catalog_service.application.dto.CategoryDTO;
import com.codeandskills.catalog_service.domain.model.Category;
import com.codeandskills.common.response.PagedResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "domainId", source = "domain.id")
    @Mapping(target = "domainTitle", source = "domain.title")
    @Mapping(target = "domainSlug", source = "domain.slug")
    @Mapping(target = "domainDescription", source = "domain.description")
    CategoryDTO toDto(Category category);

    List<CategoryDTO> toDtoList(List<Category> categories);

    @Mapping(target = "domain", ignore = true)
    Category toEntity(CategoryDTO dto);

    /**
     * 🔹 Conversion d'une Page<Category> en Page<CategoryDTO>
     */
    default Page<CategoryDTO> toDtoPage(Page<Category> categories) {
        if (categories == null) return Page.empty();
        return categories.map(this::toDto);
    }

    default PagedResponse<CategoryDTO> toPagedResponse(Page<Category> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(this::toDto).toList(),
                page.getNumber(),
                page.getTotalPages(),
                page.getSize(),
                page.getTotalElements()
        );
    }
}