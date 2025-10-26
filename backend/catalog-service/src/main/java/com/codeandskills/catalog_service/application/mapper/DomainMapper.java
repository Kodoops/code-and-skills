package com.codeandskills.catalog_service.application.mapper;

import com.codeandskills.catalog_service.application.dto.DomainDTO;
import com.codeandskills.catalog_service.domain.model.Domain;
import com.codeandskills.common.response.PagedResponse;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DomainMapper {

    DomainDTO toDto(Domain domain);
    List<DomainDTO> toDtoList(List<Domain> domains);

    Domain toEntity(DomainDTO dto);

    /**
     * 🔹 Conversion d'une Page<Domain> en Page<DomainDTO>
     */
    default Page<DomainDTO> toDtoPage(Page<Domain> domains) {
        if (domains == null) return Page.empty();
        return domains.map(this::toDto);
    }

    default PagedResponse<DomainDTO> toPagedResponse(Page<Domain> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(this::toDto).toList(),
                page.getNumber(),
                page.getTotalPages(),
                page.getSize(),
                page.getTotalElements()
        );
    }
}