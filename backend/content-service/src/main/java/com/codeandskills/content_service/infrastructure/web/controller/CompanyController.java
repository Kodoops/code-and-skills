package com.codeandskills.content_service.infrastructure.web.controller;


import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.content_service.application.dto.CompanyDTO;
import com.codeandskills.content_service.application.dto.CompanySocialLinkDTO;
import com.codeandskills.content_service.application.dto.SocialLinkDTO;
import com.codeandskills.content_service.application.service.CompanyService;
import com.codeandskills.content_service.application.service.CompanySocialLinkService;
import com.codeandskills.content_service.infrastructure.web.dto.socialLink.AttachSocialLinkRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/content/companies")
public class CompanyController {

    private final CompanySocialLinkService companySocialLinkService;
    private final CompanyService   companyService;

    public CompanyController(CompanySocialLinkService companySocialLinkService, CompanyService companyService) {
        this.companySocialLinkService = companySocialLinkService;
        this.companyService = companyService;
    }

    @GetMapping("/company")
    public ResponseEntity<ApiResponse<CompanyDTO>> getCompanyInfos() {
        List<CompanyDTO> all = companyService.getAll();
        if(all.size() == 0)
            return ResponseEntity.ok(ApiResponse.success(200, "No Company founded .", null));

        CompanyDTO company = all.get(0) ;

        return ResponseEntity.ok(
                ApiResponse.success(200, "Company social links fetched successfully", company)
        );
    }

    @GetMapping("/links")
    public ResponseEntity<ApiResponse<List<CompanySocialLinkDTO>>> getCompanySocialLinks() {
        List<CompanyDTO> all = companyService.getAll();
        if(all.size() == 0)
            return ResponseEntity.ok(ApiResponse.success(200, "No Company founded .", null));

        CompanyDTO company = all.get(0) ;

        List<CompanySocialLinkDTO> links = companySocialLinkService.getSocialLinksByCompanyId(company.getId());
        return ResponseEntity.ok(
                ApiResponse.success(200, "Company social links fetched successfully", links)
        );
    }

    @GetMapping("/links/unlinked")
    public ResponseEntity<ApiResponse<List<SocialLinkDTO>>> getUnlinkedSocialLinks() {
        List<CompanyDTO> all = companyService.getAll();
        if(all.size() == 0)
            return ResponseEntity.ok(ApiResponse.success(200, "No Company founded .", null));

        CompanyDTO company = all.get(0) ;
        List<SocialLinkDTO> links = companySocialLinkService.getUnlinkedSocialLinks(company.getId());

        return ResponseEntity.ok(
                ApiResponse.success(200, "Unlinked social links fetched successfully", links)
        );
    }

    @PostMapping("/links")
    public ResponseEntity<ApiResponse<CompanySocialLinkDTO>> attachSocialLink(
            @RequestBody AttachSocialLinkRequest request
    ) {

        List<CompanyDTO> all = companyService.getAll();
        if(all.size() == 0)
            return ResponseEntity.ok(ApiResponse.success(200, "No Company founded .", null));

        CompanyDTO company = all.get(0) ;

        CompanySocialLinkDTO dto = companySocialLinkService.attachSocialLinkToCompany(
                company.getId(),
                request.getSocialLinkId(),
                request.getUrl()
        );

        return ResponseEntity.ok(
                ApiResponse.success(200, "Social link attached successfully", dto)
        );
    }

    @DeleteMapping("/links")
    public ResponseEntity<ApiResponse<Void>> detachSocialLink(
            @RequestBody AttachSocialLinkRequest request
    ) {
        List<CompanyDTO> all = companyService.getAll();
        if(all.size() == 0)
            return ResponseEntity.ok(ApiResponse.success(200, "No Company founded .", null));

        CompanyDTO company = all.get(0) ;

        companySocialLinkService.detachSocialLinkFromCompany(company.getId(), request.getSocialLinkId());

        return ResponseEntity.ok(
                ApiResponse.success(200, "Social link detached successfully", null)
        );
    }
}