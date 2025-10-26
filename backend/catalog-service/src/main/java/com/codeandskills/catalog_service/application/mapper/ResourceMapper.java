package com.codeandskills.catalog_service.application.mapper;

import com.codeandskills.catalog_service.application.dto.ResourceDTO;
import com.codeandskills.catalog_service.domain.model.Resource;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ResourceMapper {

    ResourceDTO toDto(Resource entity);

    Resource toEntity(ResourceDTO dto);

    List<ResourceDTO> toDtoList(List<Resource> entities);
}