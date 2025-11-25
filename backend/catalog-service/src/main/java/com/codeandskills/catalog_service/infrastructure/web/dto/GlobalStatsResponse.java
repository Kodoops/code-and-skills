package com.codeandskills.catalog_service.infrastructure.web.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalStatsResponse {

    private int coursesCount;
    private int publishedCoursesCount;
    private int draftCoursesCount;
    private int archivedCoursesCount;
    private int chaptersCount;
    private int videosCount;
    private int lessonsCount;


    private int categoriesCount;
    private int domainsCount;


    private int learningPathsCount;
    private int workshopsCount;


}
