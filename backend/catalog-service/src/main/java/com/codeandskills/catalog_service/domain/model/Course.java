package com.codeandskills.catalog_service.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 2000)
    private String smallDescription;

    @Column(length = 5000)
    private String description;

    private String fileKey;

    private Integer price;

    @Column(nullable = false)
    private String currency = "EUR";

    private Integer duration;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Level level = Level.BEGINNER;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CourseStatus status = CourseStatus.DRAFT;

    @Column(unique = true)
    private String stripePriceId;

    @Column(nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private List<Chapter> chapters;

    @ElementCollection
    @CollectionTable(
            name = "course_objectives",
            joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "objective")
    private List<String> objectives;

    @ElementCollection
    @CollectionTable(
            name = "course_prerequisites",
            joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "prerequisite")
    private List<String> prerequisites;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "course_tags",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    // 🔹 Identifiants de ressources distantes (dans le microservice Resource)
    @ElementCollection
    @CollectionTable(name = "course_resource_refs", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "resource_id")
    private List<String> resourceIds;
}