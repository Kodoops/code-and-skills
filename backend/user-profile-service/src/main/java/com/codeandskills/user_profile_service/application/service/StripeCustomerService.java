package com.codeandskills.user_profile_service.application.service;

import com.codeandskills.user_profile_service.domain.model.UserProfile;
import com.codeandskills.user_profile_service.domain.repository.UserProfileRepository;
import com.stripe.Stripe;
import com.stripe.model.Customer;
import com.stripe.param.CustomerCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StripeCustomerService {

    private final UserProfileRepository userProfileRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    public UserProfile ensureStripeCustomer(String userId) throws Exception {
        Stripe.apiKey = stripeApiKey;

        // 🔹 Récupère le profil
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profil introuvable pour l'utilisateur " + userId));

        // 🔹 Si déjà un Stripe Customer ID, on le retourne
        if (profile.getStripeCustomerId() != null && !profile.getStripeCustomerId().isBlank()) {
            return profile;
        }

        // 🔹 Crée un client sur Stripe
        CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(profile.getEmail())
                .setName(profile.getFirstname() + " " + profile.getLastname())
                .putMetadata("userId", profile.getUserId())
                .build();

        Customer customer = Customer.create(params);

        // 🔹 Enregistre l’ID Stripe dans le profil
        profile.setStripeCustomerId(customer.getId());
        userProfileRepository.save(profile);

        return profile;
    }
}