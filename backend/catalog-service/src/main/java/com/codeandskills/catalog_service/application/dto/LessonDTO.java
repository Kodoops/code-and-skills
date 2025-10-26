package com.codeandskills.catalog_service.application.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {
    private String id;
    private String title;
    private String description;
    private String thumbnailKey;
    private String videoKey;
    private int position;
    private int duration;
    private boolean publicAccess;
    private String chapterId;
    private List<String> resourceIds;
}