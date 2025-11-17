package com.codeandskills.content_service.domain.repository;


import com.codeandskills.content_service.domain.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, String> {

    Optional<Company> findByEmail(String email);

    boolean existsBySiret(String siret);

    boolean existsByVatNumber(String vatNumber);
}