package com.codeandskills.content_service.infrastructure.web.controller.admin;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.content_service.application.dto.FeatureDTO;
import com.codeandskills.content_service.application.service.FeatureService;
import com.codeandskills.content_service.infrastructure.web.dto.feature.FeatureRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/content/admin/features")
@RequiredArgsConstructor
public class FeatureAdminController {

    private final FeatureService featureService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<FeatureDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        PagedResponse<FeatureDTO> filteredFeatures = featureService.getAllPaged(page, size);

        return ResponseEntity.ok(ApiResponse.success(200, "Features fetched successfully", filteredFeatures));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FeatureDTO>> getById(@PathVariable String id) {
        Optional<FeatureDTO> feature = featureService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(200, "Feature fetched successfully", feature.orElse(null)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeatureDTO>> create(@RequestBody FeatureRequest dto) {

        FeatureDTO featureDTO = new FeatureDTO();
        featureDTO.setTitle(dto.getTitle());
        featureDTO.setDesc(dto.getDesc());
        featureDTO.setIconLib(dto.getIconLib());
        featureDTO.setIconName(dto.getIconName());
        featureDTO.setColor(dto.getColor());

        FeatureDTO created = featureService.create(featureDTO);
        return ResponseEntity.ok(ApiResponse.success(201, "Feature created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FeatureDTO>> update(@PathVariable String id,
                                                          @RequestBody FeatureRequest dto) {
        FeatureDTO featureDTO = new FeatureDTO();
        featureDTO.setId(id);
        featureDTO.setTitle(dto.getTitle());
        featureDTO.setDesc(dto.getDesc());
        featureDTO.setIconLib(dto.getIconLib());
        featureDTO.setIconName(dto.getIconName());
        featureDTO.setColor(dto.getColor());

        FeatureDTO updated = featureService.update(id, featureDTO);
        return ResponseEntity.ok(ApiResponse.success(200, "Feature updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        featureService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(200, "Feature deleted successfully", null));
    }
}