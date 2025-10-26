package com.codeandskills.catalog_service.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String fileKey;
    private String url;

    @Column(nullable = false)
    private String type; // PDF, LINK, VIDEO...

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "course_id")
//    private Course course;

    // 🔹 Référence externe : Course ID depuis le catalog-service
    @Column(nullable = false)
    private String courseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}