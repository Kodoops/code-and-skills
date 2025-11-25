package com.codeandskills.billing_service.domain.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "enrollments",
        indexes = {
                @Index(name = "idx_enrollment_user", columnList = "user_id"),
                @Index(name = "idx_enrollment_course", columnList = "course_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment extends BaseEntity {

    @Column(nullable = false)
    private Integer amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentType type;

    @Column(name = "reference_id", nullable = false)
    private String referenceId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;
}