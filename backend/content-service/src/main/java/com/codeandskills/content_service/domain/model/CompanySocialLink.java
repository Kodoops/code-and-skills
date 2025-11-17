package com.codeandskills.content_service.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "company_social_links",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_company_socialLink",
                        columnNames = {"company_id", "social_link_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanySocialLink extends BaseEntity{

    @Column(name = "url", nullable = false)
    private String url;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "company_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_company_social_link_company")
    )
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "social_link_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_company_social_link_social_link")
    )
    private SocialLink socialLink;

}