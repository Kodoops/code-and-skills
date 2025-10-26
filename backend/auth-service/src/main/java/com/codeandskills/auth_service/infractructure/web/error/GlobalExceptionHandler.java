package com.codeandskills.auth_service.infractructure.web.error;

import com.codeandskills.common.security.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        log.error("❌ Auth error: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur interne du serveur", ex);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldError() != null
                ? ex.getBindingResult().getFieldError().getDefaultMessage()
                : "Erreur de validation";
        return buildResponse(HttpStatus.BAD_REQUEST, msg, ex);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        log.warn("❌ Mauvais identifiants : {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Identifiants invalides", ex);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, Object>> handleDisabledAccount(DisabledException ex) {
        log.warn("❌ Le compte utilisateur est désactivé : {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Le compte utilisateur est désactivé.", ex);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFound(UsernameNotFoundException ex) {
        log.warn("❌ Utilisateur introuvable : {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, "Utilisateur introuvable", ex);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        log.warn("❌ Accès refusé : {}", ex.getMessage());
        return buildResponse(HttpStatus.FORBIDDEN, "Accès refusé", ex);
    }

    // ⚠️ Paramètre manquant
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, Object>> handleMissingParam(MissingServletRequestParameterException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Paramètre manquant : " + ex.getParameterName(), ex);
    }

    // 🧱 Contrainte d’intégrité (doublon email, etc.)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        return buildResponse(HttpStatus.CONFLICT, "Conflit de données (ex: doublon)", ex);
    }

    // 📦 Taille de fichier dépassée
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUpload(MaxUploadSizeExceededException ex) {
        return buildResponse(HttpStatus.PAYLOAD_TOO_LARGE, "Taille de fichier trop grande", ex);
    }

    // 🧩 Erreur ResponseStatus manuelle
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.resolve(ex.getStatusCode().value());
        if (status == null) status = HttpStatus.INTERNAL_SERVER_ERROR;
        return buildResponse(status, ex.getReason() != null ? ex.getReason() : status.getReasonPhrase(), ex);
    }

    // 🪫 Token invalide, expiré, ou corrompu
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Map<String, Object>> handleJwt(JwtException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Token invalide ou expiré", ex);
    }


    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message, Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", ""); // peut être enrichi avec RequestContextHolder
        body.put("correlationId", UUID.randomUUID().toString());

        return ResponseEntity.status(status).body(body);
    }
}