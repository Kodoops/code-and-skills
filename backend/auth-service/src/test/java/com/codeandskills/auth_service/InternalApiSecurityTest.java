package com.codeandskills.auth_service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class InternalApiSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Value("${gateway.trust.secret}")
    private String gatewaySecret;

    @Test
    void shouldReturnForbiddenWithoutHeader() throws Exception {
        mockMvc.perform(get("/internal/sessions/123/status"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnForbiddenWithInvalidSecret() throws Exception {
        mockMvc.perform(get("/internal/sessions/123/status")
                        .header("X-Gateway-Secret", "wrong_value"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowWithValidSecret() throws Exception {
        mockMvc.perform(get("/internal/sessions/123/status")
                        .header("X-Gateway-Secret", gatewaySecret))
                .andExpect(status().isOk());
    }
}