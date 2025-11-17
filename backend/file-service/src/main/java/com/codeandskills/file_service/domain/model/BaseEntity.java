package com.codeandskills.file_service.domain.model;

import com.fasterxml.uuid.Generators;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
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

    @Column(updatable = false)
    @CreatedDate
    protected LocalDateTime createdAt = LocalDateTime.now();

    @UpdateTimestamp
    protected LocalDateTime updatedAt = LocalDateTime.now();

}
