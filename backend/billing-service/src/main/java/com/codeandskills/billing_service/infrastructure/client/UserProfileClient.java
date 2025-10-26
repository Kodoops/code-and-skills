package com.codeandskills.billing_service.infrastructure.client;

import com.codeandskills.billing_service.application.dto.UserProfileDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(
        name = "user-profile-service", // nom logique du microservice (Spring Cloud)
        url = "${services.user-profile-service.url}" ,// configurable dans application.yml
        configuration = FeignClientConfig.class
)
public interface UserProfileClient {

    @PostMapping("/profiles/user/public")
    UserProfileDTO getUserProfileById(@RequestBody GetPublicUserProfile userProfile);

    @PutMapping("/profiles/user/{id}/stripe-customer")
   UserProfileDTO updateStripeCustomer(@PathVariable("id") String userId,
                                              @RequestBody Map<String, String> body);

}