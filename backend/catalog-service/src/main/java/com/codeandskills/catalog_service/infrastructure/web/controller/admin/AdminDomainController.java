package com.codeandskills.catalog_service.infrastructure.web.controller.admin;

import com.codeandskills.catalog_service.application.dto.DomainDTO;
import com.codeandskills.catalog_service.application.mapper.DomainMapper;
import com.codeandskills.catalog_service.application.service.DomainService;
import com.codeandskills.catalog_service.domain.model.Domain;
import com.codeandskills.catalog_service.infrastructure.web.dto.DomainRequest;
import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/catalog/admin/domains")
@RequiredArgsConstructor
public class AdminDomainController {

    private final DomainService service;
    @Qualifier("domainMapper")
    private final DomainMapper mapper;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<DomainDTO>>> getAll() {
        List<Domain> domains = service.findAll();

        return ResponseEntity.ok(
                ApiResponse.success(200, "Domains fetched successfully", mapper.toDtoList(domains))
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DomainDTO>> getById(@PathVariable("id") String id) {

        Optional<Domain> domainDto = service.findById(id);
        if (!domainDto.isPresent()) {
            ApiResponse.success(200, "Domain got successfully",null );
        }
        return ResponseEntity.ok(
                ApiResponse.success(200, "Domain got successfully",mapper.toDto(domainDto.get()) )
        );
    }

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

    @PostMapping
    public ResponseEntity<ApiResponse<DomainDTO>> create(@RequestBody DomainRequest request) {
        Domain domain =  service.create( request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Domain created successfully", mapper.toDto(domain))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DomainDTO>> update(@PathVariable("id") String id, @RequestBody DomainRequest request) {
        Domain updated = service.update(id, request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Domain updated successfully", mapper.toDto(updated))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Domain deleted successfully", null)
        );
    }


}