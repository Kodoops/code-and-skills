package com.codeandskills.catalog_service.infrastructure.client;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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