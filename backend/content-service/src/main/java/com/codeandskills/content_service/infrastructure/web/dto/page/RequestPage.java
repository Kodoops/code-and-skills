package com.codeandskills.content_service.infrastructure.web.dto.page;

import lombok.Data;

public record RequestPage (
     String title,
     String slug,
     String content,
     String type
){}
