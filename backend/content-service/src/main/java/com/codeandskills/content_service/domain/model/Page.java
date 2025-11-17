package com.codeandskills.content_service.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Page  extends BaseEntity{

    @Column(nullable = false, unique = true)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    /**
     * Ex: "FOOTER", "PAGE", ...
     * Tu peux plus tard le remplacer par un enum @Enumerated si tu veux.
     */
    @Column(nullable = false)
    private String type;

}
