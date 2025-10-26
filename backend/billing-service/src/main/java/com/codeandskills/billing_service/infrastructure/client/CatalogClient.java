package com.codeandskills.billing_service.infrastructure.client;

import com.codeandskills.billing_service.application.dto.EnrollmentDTO.CourseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "catalog-service",
        url = "${services.catalog-service.url}"
)
public interface CatalogClient {

    @GetMapping("/catalog/public/courses/id/{id}")
    CourseDTO getCourseById(@PathVariable("id") String id);
}