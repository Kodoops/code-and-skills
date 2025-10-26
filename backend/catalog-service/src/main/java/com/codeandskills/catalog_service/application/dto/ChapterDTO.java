package com.codeandskills.catalog_service.application.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapterDTO {
    private String id;
    private String title;
    private int position;
    private String courseId;
    private List<LessonDTO> lessons;

}