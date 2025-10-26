package com.codeandskills.gateway_service.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.web.reactive.function.client.WebClient;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT,
        classes = {
                com.codeandskills.gateway_service.GatewayServiceApplication.class,
                com.codeandskills.gateway_service.config.TestGatewayConfig.class
        },
        properties = {
                "spring.profiles.active=test",
                "server.port=9090",
                "spring.cloud.gateway.discovery.locator.enabled=false",
                "spring.cloud.loadbalancer.enabled=false",        // ✅ ici
                "spring.cloud.discovery.enabled=false",           // ✅ et ici
                "eureka.client.enabled=false"                     // ✅ pour de bon
        }
)
class AuthIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Test
    void shouldLoginSuccessfullyThroughGateway() {
        WebClient webClient = webClientBuilder.build();

        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        String payload = """
            { "email": "test3@test.com", "password": "newPassword" }
        """;

        ResponseEntity<String> response = webClient.post()
                .uri(loginUrl)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(payload)
                .exchangeToMono(res -> res.toEntity(String.class))
                .block();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
      //  assertThat(response.getBody()).contains("accessToken");
    }

    @Test
    void shouldRejectInvalidJwt() {
        WebClient webClient = webClientBuilder.build();

        String url = "http://localhost:" + port + "/api/auth/profile";

        ResponseEntity<String> response = webClient.get()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Bearer invalid_token")
                .exchangeToMono(res -> res.toEntity(String.class))
                .block();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

//    @Test
//    void shouldAccessPublicEndpointWithoutToken() {
//        WebClient webClient = webClientBuilder.build();
//
//        String url = "http://localhost:" + port + "/api/auth/test";
//
//        ResponseEntity<String> response = webClient.get()
//                .uri(url)
//                .exchangeToMono(res -> res.toEntity(String.class))
//                .block();
//
//        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
//    }

    @Test
    void shouldRejectWhenSessionIsExpired() {
        WebClient webClient = webClientBuilder.build();

        String url = "http://localhost:" + port + "/api/courses";

        ResponseEntity<String> response = webClient.get()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Bearer expired.jwt.token")
                .exchangeToMono(res -> res.toEntity(String.class))
                .block();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}