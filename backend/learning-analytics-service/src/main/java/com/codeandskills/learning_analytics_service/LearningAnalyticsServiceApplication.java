package com.codeandskills.learning_analytics_service;

import com.codeandskills.common.config.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class LearningAnalyticsServiceApplication {

	public static void main(String[] args) {
		//SpringApplication.run(LearningAnalyticsServiceApplication.class, args);

		SpringApplication app = new SpringApplication(LearningAnalyticsServiceApplication.class);

		// On indique à l’app d’utiliser notre initialiseur
		app.addInitializers(new DotenvInitializer());

		// On précise le répertoire du .env pour ce service (en local)
		System.setProperty("DOTENV_DIR", "backend/learning-analytics-service");

		app.run(args);
	}

}
