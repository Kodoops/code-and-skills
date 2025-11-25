package com.codeandskills.billing_service.infrastructure.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDailyStatResponse {
    private String date;       // au format "YYYY-MM-DD"
    private int enrollments;   // nombre d'inscriptions ce jour-là
}