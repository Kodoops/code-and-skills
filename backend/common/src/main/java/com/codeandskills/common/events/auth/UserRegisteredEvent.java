package com.codeandskills.common.events.auth;

public record UserRegisteredEvent(
        String userId,
        String email,
        String firstname,
        String lastname
) {}