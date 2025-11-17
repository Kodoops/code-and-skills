package com.codeandskills.billing_service.application.service;

import com.codeandskills.billing_service.application.dto.EnrollmentDTO;
import com.codeandskills.billing_service.application.mapper.EnrollmentMapper;
import com.codeandskills.billing_service.domain.models.Enrollment;
import com.codeandskills.billing_service.domain.models.EnrollmentStatus;
import com.codeandskills.billing_service.domain.models.Payment;
import com.codeandskills.billing_service.domain.repository.EnrollmentRepository;
import com.codeandskills.billing_service.infrastructure.client.CatalogClient;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final CatalogClient catalogClient;

    public  Enrollment markAsActive(Payment payment) {
        Enrollment  enrollment =  enrollmentRepository.findByPayment(payment).orElseThrow(() -> new IllegalArgumentException(
                "❌ No enrollment found for payment id " + payment.getId())
        );
        enrollment.setStatus(EnrollmentStatus.ACTIVE);
        enrollmentRepository.save(enrollment);
        log.info("🎓 Enrollment activated for user={} course={}", enrollment.getUserId(), enrollment.getCourseId());
        return enrollment;
    }

    public List<EnrollmentDTO> getUserEnrollments(String userId) {
        List<Enrollment> enrollments = enrollmentRepository.findAllWithPaymentByUserId(userId);

        return enrollments.stream().map(EnrollmentMapper::toDTO).toList();
    }

    public PagedResponse<EnrollmentDTO> getUserEnrollmentsWithPaymentsAndCourses(String userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Enrollment> enrollmentsPage = enrollmentRepository.findByUserId(userId, pageable);

        List<EnrollmentDTO> dtos = enrollmentsPage.getContent().stream()
                .map(e -> {
                    var courseResponse = catalogClient.getCourseById(e.getCourseId());
                    return EnrollmentMapper.toDTO(e, courseResponse);
                })
                .toList();

      //  List<EnrollmentDTO> dtos = enrollmentsPage.stream().map(EnrollmentMapper::toDTO).toList();

        return new PagedResponse<>(
                dtos,
                enrollmentsPage.getNumber(),
                enrollmentsPage.getTotalPages(),
                enrollmentsPage.getSize(),
                enrollmentsPage.getTotalElements()
        );
    }

    public List<EnrollmentDTO> getActiveEnrollments(String userId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserIdAndStatus(userId, EnrollmentStatus.ACTIVE);

        return enrollments.stream().map(EnrollmentMapper::toDTO).toList();
    }

    public EnrollmentDTO checkIfCourseIsBoughtByUser(String courseId, String userId) {
        Optional<Enrollment>  enrollment = enrollmentRepository.findByUserIdAndCourseIdAndStatus(userId, courseId, EnrollmentStatus.ACTIVE);

        if (!enrollment.isPresent()) {
            return null;
        }
        return EnrollmentMapper.toDTO(enrollment.get());
    }
}
