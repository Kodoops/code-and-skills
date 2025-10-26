package com.codeandskills.common.events.catalog;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoursePublishedEvent {
    private String id;
    private String title;
    private String slug;
    private String userId;
    private String timestamp;
}