package com.codeandskills.catalog_service;

import com.codeandskills.common.config.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.codeandskills.catalog_service.infrastructure.client")
public class CatalogServiceApplication {

	public static void main(String[] args) {
		//SpringApplication.run(CatalogServiceApplication.class, args);
		SpringApplication app = new SpringApplication(CatalogServiceApplication.class);

		// On indique à l’app d’utiliser notre initialiseur
		app.addInitializers(new DotenvInitializer());

		// On précise le répertoire du .env pour ce service (en local)
		System.setProperty("DOTENV_DIR", "backend/catalog-service");

		app.run(args);
	}

}
