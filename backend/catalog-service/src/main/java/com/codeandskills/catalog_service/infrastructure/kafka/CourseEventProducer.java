package com.codeandskills.catalog_service.infrastructure.kafka;

import com.codeandskills.common.events.catalog.CourseCreatedEvent;
import com.codeandskills.common.events.catalog.CoursePublishedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class CourseEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendCourseCreatedEvent(CourseCreatedEvent event) {
        kafkaTemplate.send("course.created", event);
    }

    public void sendCoursePublishedEvent(CoursePublishedEvent event) {
        event.setTimestamp(Instant.now().toString());
        kafkaTemplate.send("course.published", event);
    }
}