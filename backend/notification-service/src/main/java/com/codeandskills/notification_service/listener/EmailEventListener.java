package com.codeandskills.notification_service.listener;

import com.codeandskills.common.events.auth.EmailRequestedEvent;
import com.codeandskills.notification_service.service.MailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import static com.codeandskills.common.events.KafkaTopics.EMAIL_EVENTS;

@Slf4j
@Component
public class EmailEventListener {

    private final MailService mailService;

    public EmailEventListener(MailService mailService) {
        this.mailService = mailService;
    }


    @KafkaListener(topics = EMAIL_EVENTS, groupId = "notification-service-group")
    public void onEmailRequested(EmailRequestedEvent event) {
        log.info("📩 Email event reçu depuis Kafka : {}", event);
        mailService.sendEmail(
                event.to(),
                event.subject(),
                event.template() // ex: "verify-account"
                , event.variables()
        );
    }


}