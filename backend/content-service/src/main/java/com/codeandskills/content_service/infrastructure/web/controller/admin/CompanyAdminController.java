package com.codeandskills.content_service.infrastructure.web.controller.admin;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.content_service.application.dto.CompanyDTO;
import com.codeandskills.content_service.application.service.CompanyService;
import com.codeandskills.content_service.infrastructure.web.dto.company.CompanyRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/content/admin/companies")
@RequiredArgsConstructor
public class CompanyAdminController {

    private final CompanyService companyService;

    @GetMapping(value = "/company")
    public ResponseEntity<ApiResponse<CompanyDTO>> getCompany() {
        List<CompanyDTO> companies = companyService.getAll();
        if(companies.size() == 0)
            return ResponseEntity.ok(ApiResponse.success(200, "No Company founded .", null));

        return ResponseEntity.ok(ApiResponse.success(200, "Companies fetched successfully", companies.get(0)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompanyDTO>>> getAll() {
        List<CompanyDTO> companies = companyService.getAll();
        return ResponseEntity.ok(ApiResponse.success(200, "Companies fetched successfully", companies));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyDTO>> getById(@PathVariable String id) {
        Optional<CompanyDTO> dto = companyService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(200, "Company fetched successfully", dto.orElse(null)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CompanyDTO>> create(@RequestBody CompanyRequest request) {
        CompanyDTO dto = new CompanyDTO();
        dto.setName(request.getName());
        dto.setAddress(request.getAddress());
        dto.setEmail(request.getEmail());
        dto.setPhone(request.getPhone());
        dto.setPostalCode(request.getPostalCode());
        dto.setCity(request.getCity());
        dto.setCountry(request.getCountry());
        dto.setVatNumber(request.getVatNumber());
        dto.setSiret(request.getSiret());
        dto.setLogoUrl(request.getLogoUrl());

        CompanyDTO created = companyService.create(dto);
        return ResponseEntity.ok(ApiResponse.success(201, "Company created successfully", created));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<CompanyDTO>> update( @RequestBody CompanyRequest request) {
        CompanyDTO dto = new CompanyDTO();
        dto.setName(request.getName());
        dto.setAddress(request.getAddress());
        dto.setEmail(request.getEmail());
        dto.setPhone(request.getPhone());
        dto.setPostalCode(request.getPostalCode());
        dto.setCity(request.getCity());
        dto.setCountry(request.getCountry());
        dto.setVatNumber(request.getVatNumber());
        dto.setSiret(request.getSiret());
        dto.setLogoUrl(request.getLogoUrl());

        CompanyDTO updated = companyService.update(dto);
        return ResponseEntity.ok(ApiResponse.success(200, "Company updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        companyService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(200, "Company deleted successfully", null));
    }
}