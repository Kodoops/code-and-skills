package com.codeandskills.auth_service.infractructure.kafka.publisher;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DomainEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(String topic, Object event) {
        kafkaTemplate.send(topic, event);
        log.info("📤 Événement [{}] envoyé à Kafka : {}", topic, event);
    }
}