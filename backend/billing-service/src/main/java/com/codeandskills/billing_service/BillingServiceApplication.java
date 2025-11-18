package com.codeandskills.billing_service;

import com.codeandskills.common.config.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.codeandskills.billing_service.infrastructure.client")
public class BillingServiceApplication {

	public static void main(String[] args) {
		//SpringApplication.run(BillingServiceApplication.class, args);

		SpringApplication app = new SpringApplication(BillingServiceApplication.class);

		// On indique à l’app d’utiliser notre initialiseur
		app.addInitializers(new DotenvInitializer());

		// On précise le répertoire du .env pour ce service (en local)
		System.setProperty("DOTENV_DIR", "backend/billing-service");

		app.run(args);
	}

}
