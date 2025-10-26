package com.codeandskills.catalog_service.application.mapper;

import com.codeandskills.catalog_service.application.dto.ChapterDTO;
import com.codeandskills.catalog_service.domain.model.Chapter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {LessonMapper.class})
public interface ChapterMapper {

    @Mapping(target = "courseId", source = "course.id")
    ChapterDTO toDto(Chapter entity);

    @Mapping(target = "course", ignore = true)
    Chapter toEntity(ChapterDTO dto);

    List<ChapterDTO> toDtoList(List<Chapter> entities);
}