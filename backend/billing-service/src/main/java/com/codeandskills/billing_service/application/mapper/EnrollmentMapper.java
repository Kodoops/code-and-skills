package com.codeandskills.billing_service.application.mapper;

import com.codeandskills.billing_service.application.dto.EnrollmentDTO;
import com.codeandskills.billing_service.domain.models.Enrollment;

public class EnrollmentMapper {

    public static EnrollmentDTO toDTO(Enrollment e, EnrollmentDTO.CourseDTO course) {
        return EnrollmentDTO.builder()
                .id(e.getId())
                .status(e.getStatus().name())
                .amount(e.getAmount())
                .currency(e.getPayment() != null ? e.getPayment().getCurrency() : "EUR")
                .course(course)
                .courseId(e.getCourseId())
                .payment(e.getPayment() != null
                        ? EnrollmentDTO.PaymentInfo.builder()
                        .id(e.getPayment().getId())
                        .method(e.getPayment().getMethod())
                        .receiptUrl(e.getPayment().getReceiptUrl())
                        .build()
                        : null)
                .build();
    }

    public static EnrollmentDTO toDTO(Enrollment e) {
        return EnrollmentDTO.builder()
                .id(e.getId())
                .status(e.getStatus().name())
                .amount(e.getAmount())
                .currency(e.getPayment() != null ? e.getPayment().getCurrency() : "EUR")
                .courseId(e.getCourseId())
                .payment(e.getPayment() != null
                        ? EnrollmentDTO.PaymentInfo.builder()
                        .id(e.getPayment().getId())
                        .method(e.getPayment().getMethod())
                        .receiptUrl(e.getPayment().getReceiptUrl())
                        .build()
                        : null)
                .build();
    }
}