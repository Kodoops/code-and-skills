package com.codeandskills.catalog_service.application.mapper;

import com.codeandskills.catalog_service.application.dto.CourseDTO;
import com.codeandskills.catalog_service.domain.model.Course;
import com.codeandskills.common.response.PagedResponse;
import org.mapstruct.*;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ChapterMapper.class, MappingUtils.class})
public interface CourseMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryTitle", source = "category.title")
  //  @Mapping(target = "tagIds", source = "tags", qualifiedByName = "mapTags")
    @Mapping(target = "tags", source = "tags")
    @Mapping(target = "userId", source = "userId")
    CourseDTO toDto(Course entity);

    @InheritInverseConfiguration(name = "toDto")
   // @Mapping(target = "tags", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "chapters", ignore = true)
    Course toEntity(CourseDTO dto);

    List<CourseDTO> toDtoList(List<Course> entities);

    default PagedResponse<CourseDTO> toDtoPage(Page<Course> page) {
        return new PagedResponse<>(
                toDtoList(page.getContent()),
                page.getNumber(),
                page.getTotalPages(),
                page.getSize(),
                page.getTotalElements()
        );
    }
}