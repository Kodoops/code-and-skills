package com.codeandskills.user_profile_service.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class GatewaySignatureFilter extends OncePerRequestFilter {

    @Value("${gateway.trust.secret:}")
    private  String trustSecret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String userId = request.getHeader("X-User-Id");
        String email = request.getHeader("X-User-Email");
        String sessionId = request.getHeader("X-Session-Id");
        String signature = request.getHeader("X-Gateway-Signature");


        if ( signature == null) {// userId == null || sessionId == null ||
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing gateway headers");
            return;
        }


        if (!trustSecret.equals(signature)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid gateway signature");
            return;
        }

        filterChain.doFilter(request, response);
    }
}