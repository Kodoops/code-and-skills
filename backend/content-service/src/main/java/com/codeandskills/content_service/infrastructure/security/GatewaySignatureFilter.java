package com.codeandskills.content_service.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
@Order(1)
public class GatewaySignatureFilter extends OncePerRequestFilter {

    @Value("${gateway.trust.secret:}")
    private String trustSecret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();
        String signature = request.getHeader("X-Gateway-Signature");

        // ✅ Vérifie d'abord la signature Gateway
        if (signature == null || !trustSecret.equals(signature)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or missing gateway signature");
            return;
        }

        // ✅ Si la route est publique → pas besoin des autres headers

        if (uri.startsWith("/content/features")  || uri.startsWith("/content/links")
                || uri.startsWith("/content/pages") || uri.startsWith("/content/companies/links")
                || uri.startsWith("/content/companies/links/unlinked")
                || uri.startsWith("/content/companies/company")
        ){
            filterChain.doFilter(request, response);
            return;
        }

        // 🔒 Sinon, vérifier la présence des en-têtes utilisateur
        String userId = request.getHeader("X-User-Id");
        String sessionId = request.getHeader("X-Session-Id");

        if (userId == null || sessionId == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing authentication headers");
            return;
        }

        filterChain.doFilter(request, response);
    }
}