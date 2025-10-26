package com.codeandskills.billing_service.domain.repository;

import com.codeandskills.billing_service.domain.models.Enrollment;
import com.codeandskills.billing_service.domain.models.EnrollmentStatus;
import com.codeandskills.billing_service.domain.models.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, String> {

    @Query("""
    SELECT e FROM Enrollment e
    LEFT JOIN FETCH e.payment
    WHERE e.userId = :userId
""")
    List<Enrollment> findAllWithPaymentByUserId(@Param("userId") String userId);

    List<Enrollment> findByUserIdAndStatus(String userId, EnrollmentStatus enrollmentStatus);

    List<Enrollment> findByUserId(String userId);
    Page<Enrollment> findByUserId(String userId, Pageable pageable);


    Optional<Enrollment> findByPayment(Payment payment);

    Optional<Enrollment> findByUserIdAndCourseIdAndStatus(String userId, String courseId, EnrollmentStatus enrollmentStatus);
}
