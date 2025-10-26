package com.codeandskills.auth_service.infractructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Order(1)
@Component
@RequiredArgsConstructor
public class InternalApiSecurityFilter extends OncePerRequestFilter {

    private final GatewaySecurityValidator validator;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Filtrer uniquement les endpoints internes
        return !request.getRequestURI().startsWith("/internal/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if (!validator.isAuthorized(request)) {
            log.warn("🚫 Unauthorized internal API call: {}", request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Forbidden: Invalid or missing X-Gateway-Secret");
            return;
        }

        log.debug("✅ Internal API access authorized: {}", request.getRequestURI());
        filterChain.doFilter(request, response);
    }
}