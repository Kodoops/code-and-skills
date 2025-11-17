package com.codeandskills.notification_service.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contact_messages")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ContactMessage extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "text")
    private String message;

    @Column(nullable = false)
    private String status;  // Exemple: RECEIVED, READ, CLOSED

    // 🔗 User ID venant d’un autre microservice
    @Column(nullable = false)
    private String userId;

    // 🔗 OneToMany replies
    @OneToMany(mappedBy = "contactMessage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContactReply> replies = new ArrayList<>();
}
