package com.codeandskills.billing_service.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@Order(3) // après GatewayAuthenticationFilter
public class SecurityDebugFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null) {
            log.info("🔍 [SecurityDebug] Authenticated user: {}", auth.getName());
            log.info("🔍 [SecurityDebug] Authorities: {}", auth.getAuthorities());
        } else {
            log.warn("🚫 [SecurityDebug] No authentication found in SecurityContext for path {}", request.getRequestURI());
        }

        filterChain.doFilter(request, response);
    }
}