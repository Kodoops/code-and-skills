package com.codeandskills.auth_service.infractructure.web.controller;


import com.codeandskills.auth_service.domain.model.User;
import com.codeandskills.auth_service.domain.model.UserSession;
import com.codeandskills.auth_service.infractructure.web.dto.*;
import com.codeandskills.auth_service.application.service.AuthService;
import com.codeandskills.auth_service.application.service.VerificationService;
import com.codeandskills.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final VerificationService verificationService;


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@RequestBody RegisterRequest request) {
        if (request.getFirstname() == null || request.getFirstname().isBlank()) {
            throw new IllegalArgumentException("Le prénom est obligatoire");
        }
        if (request.getLastname() == null || request.getLastname().isBlank()) {
            throw new IllegalArgumentException("Le nom est obligatoire");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("L'email est obligatoire");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Le mot de passe est obligatoire");
        }
        RegisterResponse response = authService.register(request);
        return ResponseEntity.ok(
                ApiResponse.success(201, "Register successful", response)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Login successful", response)
        );
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<RegisterResponse>> verifyAccount(@RequestParam("token") String token) {
        User user = verificationService.verifyAccount(token);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Verify account successful",
                        new RegisterResponse("Votre compte a bien été vérifié, vous pouvez vous connecter")
                )
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestBody TokenRefreshRequest request) {
        AuthResponse response = authService.refreshTokens(request.getRefreshToken());
        return ResponseEntity.ok(
                ApiResponse.success(200, "Refresh token successful", response)
        );
    }


    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestBody LogoutRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(
                ApiResponse.success(200, "Logout successful", null)
        );
    }

    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<String>> logoutAll(HttpServletRequest request) {
        authService.logoutAll(request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Logout All successful",
                        "All sessions have been revoked successfully.")
        );
    }

    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<UserSession>>> listSessions(@AuthenticationPrincipal User user) {
        List<UserSession> sessions = authService.getActiveSessions(user);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Get sessions successful",
                        sessions)
        );
    }
}