package com.codeandskills.catalog_service.application.mapper;

import com.codeandskills.catalog_service.domain.model.Tag;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;

public class MappingUtils {

    @Named("mapTags")
    public static List<String> mapTags(Set<Tag> tags) {
        if (tags == null) return List.of();
        return tags.stream().map(Tag::getId).toList();
    }
}