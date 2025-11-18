package com.codeandskills.user_profile_service;

import com.codeandskills.common.config.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.kafka.annotation.EnableKafka;


@SpringBootApplication
@EnableKafka
public class UserProfileServiceApplication {

	public static void main(String[] args) {
	//	SpringApplication.run(UserProfileServiceApplication.class, args);

		SpringApplication app = new SpringApplication(UserProfileServiceApplication.class);

		// On indique à l’app d’utiliser notre initialiseur
		app.addInitializers(new DotenvInitializer());

		// On précise le répertoire du .env pour ce service (en local)
		System.setProperty("DOTENV_DIR", "backend/user-profile-service");

		app.run(args);
	}

}
