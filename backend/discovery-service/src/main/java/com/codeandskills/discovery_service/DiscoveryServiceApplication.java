package com.codeandskills.discovery_service;

import com.codeandskills.common.config.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServiceApplication {
	public static void main(String[] args) {
		//SpringApplication.run(DiscoveryServiceApplication.class, args);

		SpringApplication app = new SpringApplication(DiscoveryServiceApplication.class);

		// On indique à l’app d’utiliser notre initialiseur
		app.addInitializers(new DotenvInitializer());

		// On précise le répertoire du .env pour ce service (en local)
		System.setProperty("DOTENV_DIR", "backend/discovery-service");

		app.run(args);
	}
}