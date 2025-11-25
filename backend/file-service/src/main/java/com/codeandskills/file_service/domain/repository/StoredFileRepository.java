package com.codeandskills.file_service.domain.repository;

import com.codeandskills.file_service.domain.model.StoredFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoredFileRepository extends JpaRepository<StoredFile, String> {
    Optional<StoredFile> findByKey(String key);

    @Query("""
        select f 
        from StoredFile f
        where f.status = com.codeandskills.file_service.domain.model.FileStatus.PENDING
          and f.createdAt < :threshold
    """)
    List<StoredFile> findExpiredPendingFiles(@Param("threshold") Instant threshold);

    @Query("""
       SELECT f
       FROM StoredFile f
       WHERE f.status = com.codeandskills.file_service.domain.model.FileStatus.PENDING
       AND f.createdAt < :before
       """)
    List<StoredFile> findExpiredPendingFiles(@Param("before") LocalDateTime before);

}
