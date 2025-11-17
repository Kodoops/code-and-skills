package com.codeandskills.content_service.infrastructure.web.controller.admin;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.content_service.application.dto.SocialLinkDTO;
import com.codeandskills.content_service.application.service.SocialLinkService;
import com.codeandskills.content_service.domain.model.SocialLink;
import com.codeandskills.content_service.infrastructure.web.dto.socialLink.SocialLinkRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/content/admin/social-links")
@RequiredArgsConstructor
public class SocialLinkAdminController {

    private final SocialLinkService socialLinkService;

//    @GetMapping
//    public ResponseEntity<ApiResponse<List<SocialLinkDTO>>> getAll() {
//        List<SocialLinkDTO> links = socialLinkService.getAll();
//        return ResponseEntity.ok(ApiResponse.success(200, "Social links fetched successfully", links));
//    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SocialLinkDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        PagedResponse<SocialLinkDTO> links = socialLinkService.getAllPaged(page, size);

        return ResponseEntity.ok(ApiResponse.success(200, "Features fetched successfully", links));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SocialLinkDTO>> getById(@PathVariable String id) {
        Optional<SocialLinkDTO> dto = socialLinkService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(200, "Social link fetched successfully", dto.orElse(null)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SocialLinkDTO>> create(@RequestBody SocialLinkRequest request) {

        SocialLinkDTO dto = new SocialLinkDTO();
        dto.setName(request.getName());
        dto.setIconLib(request.getIconLib());
        dto.setIconName(request.getIconName());

        SocialLinkDTO created = socialLinkService.create(dto);
        return ResponseEntity.ok(ApiResponse.success(201, "Social link created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SocialLinkDTO>> update(@PathVariable String id,
                                                             @RequestBody SocialLinkDTO dto) {
        SocialLinkDTO updated = socialLinkService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(200, "Social link updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        socialLinkService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(200, "Social link deleted successfully", null));
    }
}