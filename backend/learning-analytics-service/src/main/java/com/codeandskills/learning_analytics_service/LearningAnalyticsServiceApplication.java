package com.codeandskills.learning_analytics_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class LearningAnalyticsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearningAnalyticsServiceApplication.class, args);
	}

}
