package com.codeandskills.billing_service.infrastructure.client;

import com.codeandskills.billing_service.application.dto.CompanyDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


@FeignClient(
        name = "content-service", // nom logique du microservice (Spring Cloud)
        url = "${services.content-service.url}" ,// configurable dans application.yml
        configuration = FeignClientConfig.class
)
public interface CompanyClient {

    @GetMapping("/content/companies/company/public")
    CompanyDTO getCompanyPublicInfos();

}