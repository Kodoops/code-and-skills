package com.codeandskills.common.events.auth;

import java.io.Serializable;
import java.util.Map;

public record EmailRequestedEvent(
        String to,
        String subject,
        String template,
        Map<String, Object> variables
) implements Serializable {}