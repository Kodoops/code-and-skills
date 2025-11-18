package com.codeandskills.auth_service;

import com.codeandskills.common.config.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(scanBasePackages = {
		"com.codeandskills.auth_service",
		"com.codeandskills.common"
})
public class AuthServiceApplication {

	public static void main(String[] args) {
		//SpringApplication.run(AuthServiceApplication.class, args);

		SpringApplication app = new SpringApplication(AuthServiceApplication.class);

		// On indique à l’app d’utiliser notre initialiseur
		app.addInitializers(new DotenvInitializer());

		// On précise le répertoire du .env pour ce service (en local)
		System.setProperty("DOTENV_DIR", "backend/auth-service");

		app.run(args);

	}

}
