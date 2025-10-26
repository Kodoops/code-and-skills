package com.codeandskills.catalog_service.application.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagDTO {
    private String id;
    private String title;
    private String slug;
    private String color;
}