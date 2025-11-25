package com.codeandskills.auth_service.application.service;

import com.codeandskills.auth_service.domain.model.User;
import com.codeandskills.auth_service.domain.repository.UserRepository;
import com.codeandskills.auth_service.infractructure.web.dto.ChangePasswordRequest;
import com.codeandskills.auth_service.infractructure.web.dto.ForgotPasswordRequest;
import com.codeandskills.auth_service.infractructure.web.dto.ResetPasswordRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserAccountService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationService verificationService; // tu peux réutiliser un email sender ici

    // ✅ 1. Changement de mot de passe
    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Ancien mot de passe incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("🔑 Password changed for user={}", user.getEmail());
    }

    // ✅ 2. Génération d’un lien de reset
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        String token = UUID.randomUUID().toString();
        verificationService.createPasswordResetToken(user, token);
        log.info("📧 Reset token created for {}", user.getEmail());
    }

    // ✅ 3. Réinitialisation via token
    @Transactional
    public void resetPassword(ResetPasswordRequest request, String token) {
        User user =  verificationService.validatePasswordResetToken(token);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("🔒 Password reset successful for {}", user.getEmail());
    }
}