package com.codeandskills.user_profile_service.domain.repository;


import com.codeandskills.user_profile_service.domain.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    Optional<UserProfile> findByUserId(String userId);
}