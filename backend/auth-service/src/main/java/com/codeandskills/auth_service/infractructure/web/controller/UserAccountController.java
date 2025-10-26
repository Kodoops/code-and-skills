package com.codeandskills.auth_service.infractructure.web.controller;

import com.codeandskills.auth_service.domain.model.User;
import com.codeandskills.auth_service.infractructure.web.dto.ChangePasswordRequest;
import com.codeandskills.auth_service.infractructure.web.dto.ForgotPasswordRequest;
import com.codeandskills.auth_service.infractructure.web.dto.ResetPasswordRequest;
import com.codeandskills.auth_service.infractructure.web.dto.UserResponse;
import com.codeandskills.auth_service.application.service.UserAccountService;
import com.codeandskills.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserAccountController {

    private final UserAccountService userAccountService;

    @PatchMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody ChangePasswordRequest request
    ) {
        userAccountService.changePassword(user, request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Change password successful", "Votre mot de passé a bien été changé avec succès")
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userAccountService.forgotPassword(request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Forgot password successful", "Un email a bien été envoyé a votre méssagerie.")
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody ResetPasswordRequest request, @RequestParam("token") String token) {
        userAccountService.resetPassword(request, token);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Reset password successful", "Votre mot de passe a bien été modifié avec succès")
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(@AuthenticationPrincipal User user) {

        UserResponse userResponse = new UserResponse();
        userResponse.setEmail(user.getEmail());
        userResponse.setUsername(user.getUsername());
        userResponse.setRole(user.getRole().name());
        userResponse.setEnabled(user.isEnabled());

        return ResponseEntity.ok(
                ApiResponse.success(200, "Get User Profile  successful", userResponse   )
        );
    }

}
