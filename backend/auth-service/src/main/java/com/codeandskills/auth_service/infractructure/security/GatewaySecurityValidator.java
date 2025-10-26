package com.codeandskills.auth_service.infractructure.security;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GatewaySecurityValidator {

    @Value("${gateway.trust.secret}")
    private String gatewaySecret;

    private static final String HEADER_NAME = "X-Gateway-Secret";

    /**
     * Vérifie que la requête provient bien du Gateway.
     */
    public boolean isAuthorized(HttpServletRequest request) {
        String headerValue = request.getHeader(HEADER_NAME);
        return headerValue != null && headerValue.equals(gatewaySecret);
    }
}