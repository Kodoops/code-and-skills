package com.codeandskills.notification_service.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.*;

@Entity
@Table(
     name = "newsletter",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_newsletter_email", columnNames = "email")
        }
)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Newsletter extends BaseEntity{

        String email;
        String name;
        boolean confirmed;

}
