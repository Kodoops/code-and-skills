package com.codeandskills.notification_service.domain.model;

import com.fasterxml.uuid.Generators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;

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

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Column(updatable = false)
    @CreatedDate
    protected LocalDateTime createdAt = LocalDateTime.now();

    @UpdateTimestamp
    protected LocalDateTime updatedAt = LocalDateTime.now();

}
