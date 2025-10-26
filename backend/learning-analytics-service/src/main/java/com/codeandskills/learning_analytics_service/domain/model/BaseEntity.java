package com.codeandskills.learning_analytics_service.domain.model;

import com.fasterxml.uuid.Generators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {

    @Id
    @Column(length = 36, updatable = false, nullable = false)
    protected String id;

    @PrePersist
    public void onCreate() {
        if (this.id == null) {
            this.id = Generators.timeBasedEpochGenerator().generate().toString();
        }
    }

    @Column(updatable = false)
    protected LocalDateTime createdAt = LocalDateTime.now();

    protected LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
