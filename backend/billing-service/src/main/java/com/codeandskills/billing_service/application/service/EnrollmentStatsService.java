package com.codeandskills.billing_service.application.service;

import com.codeandskills.billing_service.domain.models.Enrollment;
import com.codeandskills.billing_service.domain.repository.EnrollmentRepository;
import com.codeandskills.billing_service.infrastructure.dto.EnrollmentDailyStatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EnrollmentStatsService {

    private static final int DEFAULT_NBR_DAYS = 30;

    private final EnrollmentRepository enrollmentRepository;

    public List<EnrollmentDailyStatResponse> getEnrollmentsStats(Integer days) {
        int nbrDays = (days == null || days <= 0) ? DEFAULT_NBR_DAYS : days;

        // Date de départ = aujourd'hui - (nbrDays - 1)
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(nbrDays - 1);

        // On récupère toutes les enrollments des N derniers jours
        LocalDateTime createdAfter = startDate.atStartOfDay();

        List<Enrollment> enrollments = enrollmentRepository
                .findByCreatedAtGreaterThanEqualOrderByCreatedAtDesc(createdAfter);

        // On groupe par date (YYYY-MM-DD)
        Map<LocalDate, Long> countByDate = new HashMap<>();

        for (Enrollment enrollment : enrollments) {
            LocalDate date = enrollment.getCreatedAt().toLocalDate();
            countByDate.merge(date, 1L, Long::sum);
        }

        // On reconstitue la liste jour par jour, même s’il y a 0 inscriptions
        List<EnrollmentDailyStatResponse> lastDays = new ArrayList<>();

        for (int i = 0; i < nbrDays; i++) {
            LocalDate date = startDate.plusDays(i);
            long count = countByDate.getOrDefault(date, 0L);

            lastDays.add(
                    new EnrollmentDailyStatResponse(
                            date.toString(),        // "YYYY-MM-DD"
                            (int) count
                    )
            );
        }

        return lastDays;
    }
}