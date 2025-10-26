package com.codeandskills.user_profile_service.infrastructure.web.controller;

import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.user_profile_service.application.dto.PublicUserProfileDTO;
import com.codeandskills.user_profile_service.application.dto.UserProfileDTO;
import com.codeandskills.user_profile_service.application.mapper.UserProfileMapper;
import com.codeandskills.user_profile_service.application.service.StripeCustomerService;
import com.codeandskills.user_profile_service.domain.model.UserProfile;
import com.codeandskills.user_profile_service.application.service.UserProfileService;
import com.codeandskills.user_profile_service.infrastructure.web.dto.GetPublicUserProfile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/profiles")
public class UserProfileController {

    private final UserProfileService profileService;
    private final StripeCustomerService stripeCustomerService;
    private final UserProfileMapper mapper;

    public UserProfileController(UserProfileService profileService, StripeCustomerService stripeCustomerService, UserProfileMapper mapper) {
        this.profileService = profileService;
        this.stripeCustomerService = stripeCustomerService;
        this.mapper = mapper;
    }


    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getMyProfile(
            @RequestHeader("X-User-Id") String userId
    ) {
        UserProfile profile = profileService.getProfile(userId);

        return ResponseEntity.ok(
                ApiResponse.success(200, "Get User Profile  successful", mapper.toDto(profile)   )
        );

    }


    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateMyProfile(@RequestBody UserProfile updated,
                                                                    @RequestHeader("X-User-Id") String userId,
                                                                    @RequestHeader("X-Gateway-Signature") String signature
                                                                    ) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User non authentifié");
        }

        UserProfile userProfile = profileService.updateProfile(userId, updated);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Update User Profile successful", mapper.toDto(userProfile))
        );
    }

    /**
     * 🔹 Vérifie ou crée un client Stripe pour ce profil
     */
    @PostMapping("/{userId}/stripe/customer")
    public ResponseEntity<ApiResponse<?>> ensureStripeCustomer(@PathVariable String userId) {
        try {
           UserProfile  updatedProfile = stripeCustomerService.ensureStripeCustomer(userId);
            return ResponseEntity.ok(
                    ApiResponse.success(
                            200,
                            "Stripe customer vérifié/créé avec succès",
                            mapper.toDto(updatedProfile)
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    ApiResponse.error(500, "error","Erreur lors de la création du client Stripe : " + e.getMessage(),
                            "/")
            );
        }
    }

    /**
     * 🔹Mise a jour du stripeCustomerId du profile
     */
    @PutMapping("/user/{id}/stripe-customer")
    UserProfileDTO updateStripeCustomer(@PathVariable("id") String userId,
                                        @RequestBody Map<String, String> body){

        UserProfile userProfile = profileService.getProfile(userId);
        userProfile.setStripeCustomerId(body.get("stripeCustomerId"));
        return mapper.toDto(profileService.updateProfile(userId, userProfile));
    }


    @PostMapping("/user/public")
    public PublicUserProfileDTO getUserProfileById(
            @RequestBody GetPublicUserProfile userProfile
    ) {
        return  profileService.getPublicProfileById(userProfile.userId());
    }
}