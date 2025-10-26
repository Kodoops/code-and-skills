package com.codeandskills.catalog_service.infrastructure.web.dto;

import org.apache.kafka.common.protocol.types.Field;

import java.util.List;

public record ListCourseIdsRequest(List<String> courseIds) {
}
