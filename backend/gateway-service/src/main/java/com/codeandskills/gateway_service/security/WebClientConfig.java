package com.codeandskills.gateway_service.security;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced // 🟢 rend compatible avec "lb://"
    public WebClient.Builder loadBalancedWebClientBuilder() {
        return WebClient.builder();
    }
}