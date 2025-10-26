package com.codeandskills.catalog_service.application.mapper;

import com.codeandskills.catalog_service.application.dto.TagDTO;
import com.codeandskills.catalog_service.domain.model.Tag;
import com.codeandskills.common.response.PagedResponse;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TagMapper {
    TagDTO toDto(Tag entity);
    Tag toEntity(TagDTO dto);
    List<TagDTO> toDtoList(List<Tag> entities);

    /**
     * 🔹 Conversion d'une Page<Domain> en Page<DomainDTO>
     */
    default Page<TagDTO> toDtoPage(Page<Tag> tags) {
        if (tags == null) return Page.empty();
        return tags.map(this::toDto);
    }

    default PagedResponse<TagDTO> toPagedResponse(Page<Tag> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(this::toDto).toList(),
                page.getNumber(),
                page.getTotalPages(),
                page.getSize(),
                page.getTotalElements()
        );
    }
}