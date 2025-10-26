package com.codeandskills.user_profile_service.application.service;


import com.codeandskills.user_profile_service.application.dto.PublicUserProfileDTO;
import com.codeandskills.user_profile_service.application.dto.UserProfileDTO;
import com.codeandskills.user_profile_service.application.mapper.UserProfileMapper;
import com.codeandskills.user_profile_service.domain.model.UserProfile;
import com.codeandskills.user_profile_service.domain.repository.UserProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserProfileService {

    private final UserProfileRepository repository;
    private final UserProfileMapper mapper;

    public UserProfileService(UserProfileRepository repository, UserProfileMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public UserProfile getProfile(String userId) {
        return repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profil non trouvé"));
    }

    public UserProfile updateProfile(String userId, UserProfile updated) {
        UserProfile existing = getProfile(userId);
        existing.setFirstname(updated.getFirstname());
        existing.setLastname(updated.getLastname());
        existing.setAvatarUrl(updated.getAvatarUrl());
        existing.setBio(updated.getBio());
        existing.setCountry(updated.getCountry());
        existing.setCity(updated.getCity());
        return repository.save(existing);
    }

    public UserProfileDTO getProfileById(String userId) {

        UserProfile userProfile =  repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profil non trouvé"));

        return mapper.toDto(userProfile);
    }

    public PublicUserProfileDTO getPublicProfileById(String userId) {
        log.info("getPublicProfileById {}", userId);
        UserProfile userProfile =  repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profil non trouvé id:  " +  userId));
        log.info("PublicProfileById {}", userProfile.getUserId());
        return mapper.toPublicDto(userProfile);
    }
}