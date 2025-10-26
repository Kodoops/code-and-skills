package com.codeandskills.user_profile_service.application.mapper;

import com.codeandskills.user_profile_service.application.dto.PublicUserProfileDTO;
import com.codeandskills.user_profile_service.application.dto.UserProfileDTO;
import com.codeandskills.user_profile_service.domain.model.UserProfile;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserProfileMapper {

    /**
     * 🔹 Convertit un modèle domaine vers un DTO
     */
    public PublicUserProfileDTO toPublicDto(UserProfile user) {
        if (user == null) return null;

        return PublicUserProfileDTO.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .stripeCustomerId(user.getStripeCustomerId())
                .userId(user.getUserId())
                .build();
    }

    /**
     * 🔹 Convertit un modèle domaine vers un DTO
     */
    public UserProfileDTO toDto(UserProfile user) {
        if (user == null) return null;

        return UserProfileDTO.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .city(user.getCity())
                .country(user.getCountry())
                .isPremium(user.isPremium())
                .lastLoginAt(user.getLastLoginAt()!=null ? user.getLastLoginAt().toString() : null)
                .userId(user.getUserId())
                .build();
    }

    /**
     * 🔹 Convertit un DTO (par ex. reçu du service UserProfile via Feign)
     *    vers le modèle domaine local (optionnel, si tu en as besoin)
     */
//    public UserProfile toEntity(UserProfileDTO dto) {
//        if (dto == null) return null;
//
//        return new UserProfile(
//                dto.getId(),
//                dto.getFirstname(),
//                dto.getLastname(),
//                dto.getEmail(),
//                dto.getAvatarUrl(),
//                dto.getBio(),
//                dto.getCountry(),
//                dto.getCity(),
//                dto.isPremium(),
//                LocalDateTime.parse(dto.getLastLoginAt()!=null ? dto.getLastLoginAt() : null)
//        );
//    }
}