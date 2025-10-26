package com.codeandskills.gateway_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"eureka.client.enabled=false",
		"spring.cloud.discovery.enabled=false",
		"spring.cloud.config.enabled=false",
		"spring.data.redis.repositories.enabled=false",
		"spring.main.web-application-type=reactive"
})
class GatewayServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
