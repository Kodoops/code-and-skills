package com.codeandskills.content_service.infrastructure.web.dto.company;

import lombok.Data;


@Data
public class CompanyRequest {
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
}
