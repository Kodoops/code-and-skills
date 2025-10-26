package com.codeandskills.catalog_service.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(length = 3000)
    private String description;

    private String thumbnailKey;
    private String videoKey;
    private int position;
    private int duration = 0;

    @Column(name = "is_public")
    private boolean publicAccess;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @ElementCollection
    @CollectionTable(name = "lesson_resource_refs", joinColumns = @JoinColumn(name = "lesson_id"))
    @Column(name = "resource_id")
    private List<String> resourceIds;
}