package com.codeandskills.content_service.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "social_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialLink extends BaseEntity{

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String iconLib;

    @Column(nullable = false)
    private String iconName;

    @OneToMany(
            mappedBy = "socialLink",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<CompanySocialLink> companySocialLinks = new ArrayList<>();
}