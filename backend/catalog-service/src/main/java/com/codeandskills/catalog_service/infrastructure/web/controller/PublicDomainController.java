package com.codeandskills.catalog_service.infrastructure.web.controller;

import com.codeandskills.catalog_service.application.dto.DomainDTO;
import com.codeandskills.catalog_service.application.mapper.DomainMapper;
import com.codeandskills.catalog_service.application.service.DomainService;
import com.codeandskills.catalog_service.domain.model.Domain;
import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequestMapping("/catalog/public/domains")
@RequiredArgsConstructor
public class PublicDomainController {

    private final DomainService service;
    @Qualifier("domainMapper")
    private final DomainMapper mapper;


    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<DomainDTO>>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "perPage", defaultValue = "10") int perPage,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name="direction" ,defaultValue = "desc") String direction
    ) {
        Page<Domain> domains = service.findAll(page, perPage, sortBy, direction);
        PagedResponse<DomainDTO> pagedResponse = mapper.toPagedResponse(domains);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Domains fetched successfully", pagedResponse)
        );
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<DomainDTO>> getBySlug(@PathVariable("slug") String slug) {

        return ResponseEntity.ok(
                ApiResponse.success(200, "Domain got successfully", mapper.toDto(service.findBySlug(slug)))
        );
    }


}