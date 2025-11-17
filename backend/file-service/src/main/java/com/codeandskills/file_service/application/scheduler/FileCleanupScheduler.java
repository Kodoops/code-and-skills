package com.codeandskills.file_service.application.scheduler;

import com.codeandskills.file_service.application.service.FileStorageService;
import com.codeandskills.file_service.domain.model.FileStatus;
import com.codeandskills.file_service.domain.model.StoredFile;
import com.codeandskills.file_service.domain.repository.StoredFileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileCleanupScheduler {

    private final StoredFileRepository repository;
    private final FileStorageService storageService;

    /**
     * Exécuté toutes les heures.
     */
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupExpiredPendingFiles() {
        log.info("🧹 Running cleanup of expired pending uploads...");

        Instant limit = Instant.now().minus(Duration.ofMinutes(30)); // ou config

        List<StoredFile> expiredFiles = repository.findExpiredPendingFiles(limit);
        if (expiredFiles.isEmpty()) {
            return;
        }

        log.info("Cleaning {} expired pending files", expiredFiles.size());

        expiredFiles.forEach(file -> {
            storageService.deleteFile(file.getKey());
            //file.setStatus(FileStatus.DELETED); // ou un champ deleted = true
        });

        repository.deleteAll(expiredFiles);
    }
}