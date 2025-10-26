package com.codeandskills.user_profile_service.infrastructure.kafka.listener;

import com.codeandskills.common.events.auth.UserRegisteredEvent;
import com.codeandskills.user_profile_service.domain.model.UserProfile;
import com.codeandskills.user_profile_service.domain.repository.UserProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserEventListener {

    private final UserProfileRepository repository;

    public UserEventListener(UserProfileRepository repository) {
        this.repository = repository;
    }

    @KafkaListener(topics = "user-events", groupId = "user-profile-service-group")
    public void handleUserRegistered(UserRegisteredEvent event) {
        log.info("event handled");
        if (repository.findByUserId(event.userId()).isEmpty()) {
            UserProfile profile = new UserProfile(
                    event.userId(),
                    event.firstname(),
                    event.lastname(),
                    event.email()
            );
            repository.save(profile);
            log.info("✅ Profil créé pour le nouvel utilisateur {}", event.email());
        }
    }
}