package com.codeandskills.file_service.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "files")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class StoredFile extends BaseEntity{

    @Column(nullable = false)
    private String key;              // clé S3 (ex: uploads/avatars/xxx.png)

    @Column(nullable = false)
    private String originalName;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long size;

    @Column(nullable = false)
    private String fileType;         // "IMAGE", "VIDEO", "FILE", "AVATAR", "COURSE_THUMBNAIL"...

    @Column
    private String ownerId;          // X-User-Id

    @Column
    private String tenantId;         // si tu veux multi-tenant plus tard

    @Column(nullable = false)
    private boolean deleted;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FileStatus status = FileStatus.PENDING;

    @Column(nullable = true)
    private Instant expiresAt;

}