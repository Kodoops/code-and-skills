package com.codeandskills.billing_service.application.service;

import com.codeandskills.billing_service.application.dto.UserProfileDTO;
import com.codeandskills.billing_service.infrastructure.client.GetPublicUserProfile;
import com.codeandskills.billing_service.infrastructure.client.UserProfileClient;
import com.codeandskills.billing_service.infrastructure.dto.EnsureCustomerResponse;
import com.stripe.param.CustomerCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {
    private final UserProfileClient userProfileClient;

    public EnsureCustomerResponse ensureCustomer(String userId) throws Exception {

        UserProfileDTO profileDto = userProfileClient.getUserProfileById(new GetPublicUserProfile(userId));

        if (profileDto.getStripeCustomerId() != null) {
            return new EnsureCustomerResponse(profileDto.getStripeCustomerId());
        }
        var customer = com.stripe.model.Customer.create(
                CustomerCreateParams.builder()
                        .putMetadata("userId", userId)
                        .build()
        );

        log.info("Created Stripe customer: {}", customer.getId());

        userProfileClient.updateStripeCustomer(userId, customer.getId());
        //userProfileClient.updateStripeCustomer(userId, Map.of("stripeCustomerId", customer.getId()));

        log.info("Updated UserProfile with Stripe customer id: {}", customer.getId());

        return new EnsureCustomerResponse(customer.getId());
    }
}
