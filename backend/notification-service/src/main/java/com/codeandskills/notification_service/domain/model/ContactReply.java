package com.codeandskills.notification_service.domain.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contact_replies")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ContactReply extends BaseEntity {

    @Column(nullable = false)
    private String adminId; // l’admin qui répond

    @Column(nullable = false, columnDefinition = "text")
    private String response;

    // 🔗 ManyToOne vers ContactMessage
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_message_id", nullable = false)
    private ContactMessage contactMessage;
}