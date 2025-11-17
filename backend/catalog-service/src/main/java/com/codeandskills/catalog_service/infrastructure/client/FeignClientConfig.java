package com.codeandskills.catalog_service.infrastructure.client;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignClientConfig {

    @Value( "${internal.secret}")
    private String internalServiceAuthKey;
    @Value("${gateway.trust.secret}")
    private String gatewayTrustSecret;

    @Bean
    public RequestInterceptor internalAuthInterceptor() {
        return requestTemplate -> {
            requestTemplate.header("X-Service-Auth", internalServiceAuthKey);
        };
    }
//
//    @Bean
//    public RequestInterceptor gatewayAuthInterceptor() {
//        return requestTemplate -> {
//            requestTemplate.header("X-Gateway-Signature", gatewayTrustSecret);
//        };
//    }

    @Bean
    public RequestInterceptor forwardAuthHeaders() {
        return template -> {
            var attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs == null) return;
            var req = attrs.getRequest();

            // JWT utilisateur
            String auth = req.getHeader("Authorization");
            if (auth != null && !auth.isBlank()) {
                template.header("Authorization", auth);
            }

            // Signature interne (si tu en as une)
            String sig = req.getHeader("X-Gateway-Signature");
            if (sig != null && !sig.isBlank()) {
                template.header("X-Gateway-Signature", sig);
            }

            // Corrélation (optionnel mais utile)
            String corr = req.getHeader("X-Correlation-Id");
            if (corr != null) {
                template.header("X-Correlation-Id", corr);
            }
        };
    }

}