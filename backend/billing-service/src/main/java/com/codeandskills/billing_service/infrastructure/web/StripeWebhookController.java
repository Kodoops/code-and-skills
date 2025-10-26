package com.codeandskills.billing_service.infrastructure.web;

import com.codeandskills.billing_service.application.service.StripeWebhookService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/billing/webhook")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    private final StripeWebhookService service;


    @PostMapping(consumes = {MediaType.ALL_VALUE})
    public ResponseEntity<String> handle(HttpServletRequest request) {

        try {
            String payload = new String(request.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            String sigHeader = request.getHeader("stripe-signature");

            service.handle(payload, sigHeader);
            return ResponseEntity.ok("Webhook reçu avec succès");

        } catch (IOException e) {
            log.error("Erreur lecture du corps : {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur lecture du corps : " + e.getMessage());
        } catch (Exception e) {
            log.error("Erreur Stripe : {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur Stripe : " + e.getMessage());
        }
    }
}