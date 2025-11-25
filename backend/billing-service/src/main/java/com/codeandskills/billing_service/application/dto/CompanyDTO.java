package com.codeandskills.billing_service.application.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CompanyDTO {
    private String id;
    private String name;
    private String address;
    private String postalCode;
    private String city;
    private String country;
    private String email;
    private String phone;
    private String siret;
    private String vatNumber;
    private String logoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Optionnel : les liens sociaux déjà "résolus"
    private List<CompanySocialLinkDTO> socialLinks;
}