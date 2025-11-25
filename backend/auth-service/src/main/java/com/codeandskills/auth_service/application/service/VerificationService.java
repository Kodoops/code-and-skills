package com.codeandskills.auth_service.application.service;

import com.codeandskills.auth_service.domain.model.User;
import com.codeandskills.auth_service.domain.model.VerificationToken;
import com.codeandskills.auth_service.domain.model.VerificationTokenType;
import com.codeandskills.auth_service.domain.repository.UserRepository;
import com.codeandskills.auth_service.domain.repository.VerificationTokenRepository;
import com.codeandskills.auth_service.infractructure.kafka.publisher.DomainEventPublisher;
import com.codeandskills.common.events.auth.EmailRequestedEvent;
import com.codeandskills.common.events.auth.UserRegisteredEvent;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import static com.codeandskills.common.events.KafkaTopics.EMAIL_EVENTS;
import static com.codeandskills.common.events.KafkaTopics.USER_EVENTS;


@Slf4j
@Service
@RequiredArgsConstructor
public class VerificationService {

    @Value( "${app.frontendUrl}")
    String FRONT_BASE_URL  ;

    @Value( "${app.name}")
    String ApplicationName ;

    private final VerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;

    private final DomainEventPublisher domainEventPublisher;

    @Transactional
    public void createVerificationToken(User user, String firstname, String lastname) {

        tokenRepository.deleteByUser(user);

        VerificationToken verificationToken = VerificationToken.generate(user);
        tokenRepository.save(verificationToken);

        if (domainEventPublisher != null) {
            domainEventPublisher.publish(EMAIL_EVENTS ,  sendAccountVerificationEmail(user, verificationToken.getToken(), firstname));
            domainEventPublisher.publish(USER_EVENTS, new UserRegisteredEvent(
                    user.getId(), user.getEmail(),firstname, lastname
            ));
        }

        log.info("✅ Email de vérification envoyé à " + user.getEmail() +
                " : " + FRONT_BASE_URL + "/verify?token=" + verificationToken.getToken());
    }

    @Transactional
    public User verifyAccount(String tokenValue) {
        VerificationToken verificationToken = tokenRepository
                .findByTokenAndType(tokenValue, VerificationTokenType.ACCOUNT_VERIFICATION)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));

        if (verificationToken.isExpired() || verificationToken.isUsed()) {
            throw new IllegalArgumentException("Token expired or already used");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        verificationToken.setUsed(true);
        tokenRepository.save(verificationToken);

        log.info("✅ Account verified for {}", user.getEmail());

        return user;
    }


    public void createPasswordResetToken(User user, String token) {

        tokenRepository.deleteByUser(user);
        List<VerificationToken> all = tokenRepository.findAll();

        VerificationToken resetToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .type(VerificationTokenType.PASSWORD_RESET)
                .expiresAt(Instant.now().plus(1, ChronoUnit.HOURS))
                .used(false)
                .build();

        tokenRepository.save(resetToken);

        if (domainEventPublisher != null) {
            domainEventPublisher.publish(EMAIL_EVENTS ,sendResetPasswordEmail(user, token));
        }

        log.info("🔑 Password reset token created for {}", user.getEmail());
    }

    public User validatePasswordResetToken(String token) {

        VerificationToken verificationToken = tokenRepository
                .findByTokenAndType(token, VerificationTokenType.PASSWORD_RESET)
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));

        if (verificationToken.isExpired() || verificationToken.isUsed()) {
            throw new IllegalArgumentException("Token expired or already used");
        }

        verificationToken.setUsed(true);
        tokenRepository.save(verificationToken);

        if (domainEventPublisher != null) {
            domainEventPublisher.publish(EMAIL_EVENTS ,sendUpdatePasswordEmail(verificationToken.getUser()));
        }

        log.info("🔑 Password updated successfully.");
        return verificationToken.getUser();
    }

    public EmailRequestedEvent sendAccountVerificationEmail(User user, String token, String firstname) {
        Map<String, Object> variables = Map.of(
                "userName", firstname!= null ? firstname:  "",
                "verificationLink", FRONT_BASE_URL + "/verify?token=" + token
        );

        EmailRequestedEvent event = new EmailRequestedEvent(
                user.getEmail(),
                "Vérification de votre compte  " + ApplicationName ,
                "verify-account",
                variables
        );

        return event;
    }

    public EmailRequestedEvent sendResetPasswordEmail(User user, String token) {

        Map<String, Object> variables = Map.of(
                "userName",  "",
                "resetPasswordLink", FRONT_BASE_URL + "/reset-password?token=" + token
        );

        EmailRequestedEvent event = new EmailRequestedEvent(
                user.getEmail(),
                "Réinitialisation du mot de passe de votre compte " + ApplicationName ,
                "reset-password",
                variables
        );

        return event;
    }

    public EmailRequestedEvent sendUpdatePasswordEmail(User user) {

        Map<String, Object> variables = Map.of(
                "userName", "",
                "profileLink", FRONT_BASE_URL + "/dashboard"
        );

        EmailRequestedEvent event = new EmailRequestedEvent(
                user.getEmail(),
                "Mise à jour du mot de passe de votre compte  " + ApplicationName,
                "update-password",
                variables
        );

        return event;

    }
}