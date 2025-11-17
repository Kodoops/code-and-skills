package com.codeandskills.content_service.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.codeandskills.content_service.domain.model.SocialLink;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SocialLinkRepository extends JpaRepository<SocialLink, String> {

    Optional<SocialLink> findByName(String name);

    Optional<SocialLink> findByIconLibAndIconName(String iconLib, String iconName);

    @Query("""
        SELECT s 
        FROM SocialLink s 
        WHERE s.id NOT IN (
            SELECT csl.socialLink.id 
            FROM CompanySocialLink csl 
            WHERE csl.company.id = :companyId
        )
    """)
    List<SocialLink> findSocialLinksNotLinkedToCompany(String companyId);
}