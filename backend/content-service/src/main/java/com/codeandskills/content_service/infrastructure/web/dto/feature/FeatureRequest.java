package com.codeandskills.content_service.infrastructure.web.dto.feature;

import lombok.Data;


@Data
public class FeatureRequest {
    private String title;
    private String desc;
    private String color;
    private String iconName;
    private String iconLib;
}
