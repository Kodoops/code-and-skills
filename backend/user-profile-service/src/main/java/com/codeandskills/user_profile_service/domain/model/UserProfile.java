package com.codeandskills.user_profile_service.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_profiles")
public class UserProfile  extends BaseEntity{

    private String firstname;
    private String lastname;
    private String email;
    private String avatarUrl;
    private String title;
    @Column(length = 2000)
    private String bio;
    private String country;
    private String city;
    private boolean isPremium;
    private LocalDateTime lastLoginAt;

    @Column(name = "stripe_customer_id", unique = true)
    private String stripeCustomerId;

    @Column(nullable = false, updatable = false)
    private String userId; // FK logique vers AuthService

    public UserProfile(String id, String firstname, String lastname, String email) {
        super();
        this.firstname = firstname;
        this.lastname = lastname;
        this.userId = id;
        this.email = email;
    }

}