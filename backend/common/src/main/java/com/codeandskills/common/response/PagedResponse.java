package com.codeandskills.common.response;

import java.util.List;

public record PagedResponse<T>(
        List<T> content,
        int currentPage,
        int totalPages,
        int perPage,
        long totalElements
) {}