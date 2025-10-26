package com.codeandskills.auth_service.infractructure.web.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO utilisé pour rafraîchir un access token.
 * Le client envoie son refreshToken pour obtenir un nouveau accessToken.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenRefreshRequest {
    private String refreshToken;
}