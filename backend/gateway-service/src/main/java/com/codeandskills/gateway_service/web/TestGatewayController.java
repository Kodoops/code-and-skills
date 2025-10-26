package com.codeandskills.gateway_service.web;

import com.codeandskills.gateway_service.security.SessionIntrospectionClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/gateway/test")
@RequiredArgsConstructor
public class TestGatewayController {

    private final SessionIntrospectionClient sessionClient;

    @GetMapping("/session/{id}")
    public Mono<Boolean> testSession(@PathVariable("id") String id) {
        return sessionClient.isSessionActive(id);
    }
}