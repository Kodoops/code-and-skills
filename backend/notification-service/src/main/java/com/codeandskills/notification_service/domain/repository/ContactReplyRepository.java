package com.codeandskills.notification_service.domain.repository;

import com.codeandskills.notification_service.domain.model.ContactReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactReplyRepository extends JpaRepository<ContactReply, String> {
    List<ContactReply> findByContactMessageId(String messageId);
}