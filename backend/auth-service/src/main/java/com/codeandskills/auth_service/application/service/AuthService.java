package com.codeandskills.auth_service.application.service;

import com.codeandskills.auth_service.domain.model.Role;
import com.codeandskills.auth_service.domain.model.User;
import com.codeandskills.auth_service.domain.model.UserSession;
import com.codeandskills.auth_service.domain.repository.UserRepository;
import com.codeandskills.auth_service.domain.repository.UserSessionRepository;
import com.codeandskills.auth_service.infractructure.web.dto.*;
import com.codeandskills.common.security.JwtException;
import com.codeandskills.common.security.JwtService;
import com.codeandskills.common.security.JwtValidationResult;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserSessionRepository sessionRepository;
    private final VerificationService verificationService;

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(false)
                .build();

        userRepository.save(user);
        verificationService.createVerificationToken(user, request.getFirstname(), request.getLastname());
        log.info("✅ New User registered for user={} ", user.getEmail());

        return new RegisterResponse(
                "User registered successfully. Please verify your email."
        );
    }


    public AuthResponse authenticate(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            System.out.println("✅ AuthenticationManager OK");
        } catch (Exception e) {
            System.out.println("❌ Authentication failed: " + e.getMessage());
            throw e;
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        return createAuthResponse(user);
    }

    public AuthResponse createAuthResponse(User user) {
        String refreshToken = UUID.randomUUID().toString();
        UserSession session = UserSession.builder()
                .user(user)
                .refreshToken(refreshToken)
                .expiresAt(Instant.now().plus(30, ChronoUnit.DAYS))
                .revoked(false)
                .build();
        sessionRepository.save(session);

        String accessToken = jwtService.generateToken(user.getId(),user.getEmail(), user.getRole().name() ,session.getId());
        log.info("✅ New session created for user={} sessionId={}", user.getEmail(), session.getId());

        return new AuthResponse(accessToken, refreshToken, getUserResponse(user));
    }


    @Scheduled(cron = "0 0 0 * * *") // tous les jours à minuit
    public void cleanExpiredSessions() {
        List<UserSession> sessions = sessionRepository.findAll();
        sessions.stream()
                .filter(UserSession::isExpired)
                .forEach(sessionRepository::delete);
        log.info("🧹 Expired sessions cleaned: {}", sessions.size());
    }


    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is required for logout.");
        }
        sessionRepository.findByRefreshToken(refreshToken)
                .ifPresentOrElse(session -> {
                    sessionRepository.delete(session);
                    log.info("🔒 Session revoked ");
                }, () -> {
                    log.warn("Attempted logout with invalid refresh token: {}", refreshToken);
                });
    }

    @Transactional
    public void logoutAll(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new JwtException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7).trim();

        JwtValidationResult result = jwtService.validateToken(token);
         System.out.println("Token validation result: " + result);

         if (!result.isValid()) {
             throw new JwtException("Invalid or expired token");
         }

         String userId = result.getUserId();

         if (userId == null) {
             throw new JwtException("Token does not contain userId");
         }
         sessionRepository.deleteAllByUserId(userId);

    }

    public AuthResponse refreshTokens(String oldRefreshToken) {
        UserSession oldSession = sessionRepository.findByRefreshToken(oldRefreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));

        if (oldSession.isExpired() || oldSession.isRevoked()) {
            throw new IllegalStateException("Session expired or revoked");
        }

        oldSession.setRevoked(true);
        sessionRepository.save(oldSession);

        // Créer la nouvelle
        String newRefreshToken = UUID.randomUUID().toString();
        UserSession newSession = UserSession.builder()
                .user(oldSession.getUser())
                .refreshToken(newRefreshToken)
                .expiresAt(Instant.now().plus(30, ChronoUnit.DAYS))
                .revoked(false)
                .build();
        sessionRepository.save(newSession);

        String newAccessToken = jwtService.generateToken(
                oldSession.getUser().getId(),
                oldSession.getUser().getEmail(),
                oldSession.getUser().getRole().name(),
                newSession.getId());
        log.info("♻️ Refreshed session for user={} newSessionId={}", oldSession.getUser().getEmail(), newSession.getId());

        return new AuthResponse(newAccessToken, newRefreshToken, getUserResponse(oldSession.getUser()) );
    }

    public List<UserSession> getActiveSessions(User user) {
        return sessionRepository.findAllByUserAndRevokedFalse(user);
    }


    private static UserResponse getUserResponse(User user) {
        UserResponse userResponse = UserResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .enabled(user.isEnabled())
                .role(user.getRole().name())
                .build();
        return userResponse;
    }
}