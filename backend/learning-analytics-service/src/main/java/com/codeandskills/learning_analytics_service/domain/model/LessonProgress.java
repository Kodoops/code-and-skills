package com.codeandskills.learning_analytics_service.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgress extends BaseEntity {


    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String lessonId;

    @Column(nullable = false)
    private String courseId;

    private boolean completed;

    private LocalDateTime completedAt;



}