package com.codeandskills.billing_service.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDTO {

    private String id;
    private String status;
    private Integer amount;
    private String currency;
    private CourseDTO course;
    private String courseId;
    private PaymentInfo payment;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseDTO { // 🔹 doit être static
        private String id;
        private String title;
        private String slug;
        private String smallDescription;
        private String description;
        private String fileKey;
        private Integer price;
        private String currency;
        private Integer duration;
        private String status;
        private String level;
        private String stripePriceId;
        private String userId;
        private String categoryId;
        private String categoryTitle;
        private List<String> objectives;
        private List<String> prerequisites;
        private List<String> resourceIds;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    public static class PaymentInfo {
        private String id;
        private String method;
        private String receiptUrl;
    }
}