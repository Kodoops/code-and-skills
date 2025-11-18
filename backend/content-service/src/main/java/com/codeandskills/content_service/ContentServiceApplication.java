package com.codeandskills.content_service;

import com.codeandskills.common.config.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ContentServiceApplication {

	public static void main(String[] args) {
		//SpringApplication.run(ContentServiceApplication.class, args);

		SpringApplication app = new SpringApplication(ContentServiceApplication.class);

		// On indique à l’app d’utiliser notre initialiseur
		app.addInitializers(new DotenvInitializer());

		// On précise le répertoire du .env pour ce service (en local)
		System.setProperty("DOTENV_DIR", "backend/content-service");

		app.run(args);
	}

}
