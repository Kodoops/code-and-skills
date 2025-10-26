package com.codeandskills.billing_service.infrastructure.client;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;

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

    @Bean
    public RequestInterceptor gatewayAuthInterceptor() {
        return requestTemplate -> {
            requestTemplate.header("X-Gateway-Signature", gatewayTrustSecret);
        };
    }

}