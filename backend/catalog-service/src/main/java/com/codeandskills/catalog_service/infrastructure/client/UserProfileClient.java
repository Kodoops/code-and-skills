package com.codeandskills.catalog_service.infrastructure.client;

import com.codeandskills.catalog_service.application.dto.UserProfileDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "user-profile-service", // nom logique du microservice (Spring Cloud)
        url = "${services.user-profile-service.url}" ,// configurable dans application.yml
    configuration = FeignClientConfig.class
)
public interface UserProfileClient {

    @PostMapping("/profiles/public")
    UserProfileDTO getUserProfileById( @RequestBody GetPublicUserProfile userProfile);

}