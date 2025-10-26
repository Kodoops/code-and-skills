package com.codeandskills.catalog_service.application.mapper;

import com.codeandskills.catalog_service.application.dto.LessonDTO;
import com.codeandskills.catalog_service.domain.model.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    @Mapping(target = "chapterId", source = "chapter.id")
    LessonDTO toDto(Lesson entity);

    @Mapping(target = "chapter", ignore = true)
    Lesson toEntity(LessonDTO dto);

    List<LessonDTO> toDtoList(List<Lesson> entities);
}