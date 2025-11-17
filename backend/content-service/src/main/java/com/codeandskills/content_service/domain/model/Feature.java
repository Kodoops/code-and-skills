package com.codeandskills.content_service.domain.model;


import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(
        name = "features",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_feature_title", columnNames = "title")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feature extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "text")
    private String desc;

    private String color;

    private String iconName;

    private String iconLib;

}
