package com.codeandskills.content_service.domain.repository;

import com.codeandskills.content_service.domain.model.CompanySocialLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CompanySocialLinkRepository extends JpaRepository<CompanySocialLink, String> {

    List<CompanySocialLink> findByCompanyId(String companyId);

    List<CompanySocialLink> findBySocialLinkId(String socialLinkId);

    boolean existsByCompanyIdAndSocialLinkId(String companyId, String socialLinkId);

   // void deleteByCompanyIdAndSocialLinkId(String companyId, String socialLinkId);

    @Modifying
    @Query("""
        DELETE FROM CompanySocialLink csl
        WHERE csl.company.id = :companyId
          AND csl.socialLink.id = :socialLinkId
    """)
    void deleteByCompanyIdAndSocialLinkId(@Param("companyId") String companyId,
                                          @Param("socialLinkId") String socialLinkId);

    Optional<CompanySocialLink> findByCompanyIdAndSocialLinkId(String companyId, String socialLinkId);

}