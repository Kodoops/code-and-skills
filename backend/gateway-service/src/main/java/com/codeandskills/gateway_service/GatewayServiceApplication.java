package com.codeandskills.gateway_service;

import com.codeandskills.common.config.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
		"com.codeandskills.gateway_service",
		"com.codeandskills.common" // 👈 pour inclure le module commun
})
public class GatewayServiceApplication {

	public static void main(String[] args) {
		//SpringApplication.run(GatewayServiceApplication.class, args);

		SpringApplication app = new SpringApplication(GatewayServiceApplication.class);

		// On indique à l’app d’utiliser notre initialiseur
		app.addInitializers(new DotenvInitializer());

		// On précise le répertoire du .env pour ce service (en local)
		System.setProperty("DOTENV_DIR", "backend/gateway-service");

		app.run(args);
	}

}
