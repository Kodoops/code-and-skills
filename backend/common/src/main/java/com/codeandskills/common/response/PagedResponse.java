package com.codeandskills.common.response;

import lombok.Builder;

import java.util.List;

@Builder
public record PagedResponse<T>(
        List<T> content,
        int currentPage,
        int totalPages,
        int perPage,
        long totalElements
) {}