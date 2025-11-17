package com.codeandskills.file_service.application.service;

import com.codeandskills.file_service.application.dto.FileInfoDTO;
import com.codeandskills.file_service.application.dto.ListFilesResponse;
import com.codeandskills.file_service.domain.model.FileStatus;
import com.codeandskills.file_service.domain.model.StoredFile;
import com.codeandskills.file_service.domain.repository.StoredFileRepository;
import com.codeandskills.file_service.infrastructure.web.dto.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {

    private final StoredFileRepository repository;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;
    @Value("${aws.s3.region}")
    private String region;

    @Transactional
    public FileUploadResponse uploadFile(MultipartFile file, String folder, String fileType, String ownerId) {
        try {
            // 1) Normaliser le folder (ex: "public/avatars", "private/uploads")
            String normalizedFolder = (folder == null || folder.isBlank())
                    ? "private/uploads"
                    : folder.replaceAll("^/+", "").replaceAll("/+$", "");

            boolean isPublic = normalizedFolder.startsWith("public/");

            String extension = "";
            String originalName = file.getOriginalFilename();
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String key = buildKey(normalizedFolder, fileType, extension);

            // 2) Construire la requête S3
            PutObjectRequest.Builder putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize());
            //.acl(ObjectCannedACL.PUBLIC_READ)// ou PRIVATE si tu veux des presigned URLs après
            //.build();

            if (isPublic) {
                putObjectRequest.acl(ObjectCannedACL.PUBLIC_READ);
            }

            s3Client.putObject(
                    putObjectRequest.build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            // 3) Sauvegarder en base
            StoredFile entity = StoredFile.builder()
                    .key(key)
                    .originalName(originalName)
                    .contentType(file.getContentType())
                    .size(file.getSize())
                    .fileType(fileType != null ? fileType : "GENERIC")
                    .ownerId(ownerId)
                    .deleted(false)
                    .status(FileStatus.UPLOADED)
                    .expiresAt(null)              // pour upload direct, pas de TTL
                    .build();

            repository.save(entity);

            // 4) Construire l'URL publique seulement si public
            String encodedKey = URLEncoder.encode(key, StandardCharsets.UTF_8);
            String url = null;
            if (isPublic) {
                url = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + encodedKey;
            }

            return new FileUploadResponse(
                    key,
                    url,
                    originalName,
                    file.getContentType(),
                    file.getSize()
            );
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l’upload du fichier ", e);
        }
    }

    private String buildKey(String folder, String fileType, String extension) {
        String uuid = UUID.randomUUID().toString();
        StringBuilder sb = new StringBuilder();

        if (folder != null && !folder.isBlank()) {
            sb.append(folder.strip()).append("/");
        }

        if (fileType != null && !fileType.isBlank()) {
            sb.append(fileType.strip()).append("/");
        }

        sb.append(uuid).append(extension);

        return sb.toString();
    }


    public PresignUploadResponse createPresignedUpload(
            PresignUploadRequest request,
            String ownerId
    ) {

        long expiresInSeconds = 600L; // tu l'as déjà pour l'URL

        // 1) Construire une clé S3 propre (par type)
        String prefix = request.isImage() ? "images" :
                request.isVideo() ? "videos" : "files";

        String key = request.folder() + "/" + prefix + "/" + UUID.randomUUID() + "_" + request.fileName();
        //  Créer la requête de presign (ex: 10 min)

        // 2) Générer l'URL pré-signée
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(request.contentType())
                .contentLength(request.size())
                .build();

        // S3Presigner presigner = S3Presigner.create();
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);

        // 3) Sauvegarder un enregistrement "en attente" (optionnel)
        StoredFile file = StoredFile.builder()
                .key(key)
                .originalName(request.fileName())
                .contentType(request.contentType())
                .size(request.size())
                .fileType(request.fileType() != null ? request.fileType() : "GENERIC")
                .ownerId(ownerId)
                .deleted(false)
                .status(FileStatus.PENDING)
                .expiresAt(Instant.now().plusSeconds(expiresInSeconds))
                .build();

        repository.save(file);

        return new PresignUploadResponse(presignedRequest.url().toString(), key, expiresInSeconds);
    }

    public PresignDownloadResponse createPresignedDownload(String key) {

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);

        return new PresignDownloadResponse(
                presignedRequest.url().toString(),
                900 // 15 min
        );
    }

    @Transactional
    public void deleteFile(String key, String ownerId) {
        StoredFile file = repository.findByKey(key)
                .orElseThrow(() -> new EntityNotFoundException("File not found"));

        // Optionnel: vérifier ownerId == file.getOwnerId() ou role ADMIN
        if(file.getOwnerId() != null && !file.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Vous ne pouvez pas supprimer un fichier dont vous n'etes pas propriètaire.");
        }
        // 1) Suppression S3
        DeleteObjectResponse deleteObjectResponse = s3Client.deleteObject(b -> b.bucket(bucketName).key(key));
        if(!deleteObjectResponse.sdkHttpResponse().isSuccessful()) {
            throw new IllegalArgumentException("Erreur lors de la suppression dui fichier");
        }

        // 2) Marquer comme deleted
         repository.delete(file);
    }


    @Transactional
    public void deleteFile(String key) {
        StoredFile file = repository.findByKey(key)
                .orElseThrow(() -> new EntityNotFoundException("File not found"));

        // 1) Suppression S3
        DeleteObjectResponse deleteObjectResponse = s3Client.deleteObject(b -> b.bucket(bucketName).key(key));
        if(!deleteObjectResponse.sdkHttpResponse().isSuccessful()) {
            throw new IllegalArgumentException("Erreur lors de la suppression dui fichier");
        }

        // 2) Marquer comme deleted
        repository.delete(file);
    }

    public ListFilesResponse listFiles(String prefix, Integer limit, String continuationToken) {
        int maxKeys = (limit != null && limit > 0 && limit <= 1000) ? limit : 50;

        ListObjectsV2Request.Builder builder = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .maxKeys(maxKeys);

        if (prefix != null && !prefix.isBlank()) {
            builder.prefix(prefix);
        }
        if (continuationToken != null && !continuationToken.isBlank()) {
            builder.continuationToken(continuationToken);
        }

        ListObjectsV2Response response = s3Client.listObjectsV2(builder.build());

        List<FileInfoDTO> files = response.contents()
                .stream()
                .map(obj -> FileInfoDTO.builder()
                        .key(obj.key())
                        .url(buildPublicUrl(obj.key()))
                        .size(obj.size())
                        .lastModified(obj.lastModified())
                        .etag(obj.eTag())
                        .build()
                )
                .toList();

        return ListFilesResponse.builder()
                .files(files)
                .nextContinuationToken(response.nextContinuationToken())
                .build();
    }

    private String buildPublicUrl(String key) {

        String encodedKey = URLEncoder.encode(key, StandardCharsets.UTF_8);
        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + encodedKey;
    }


    public boolean checkFileExist(String key) {

        try {
            s3Client.headObject(HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build()
            );
            return true;

        } catch (Exception e) {
            throw new IllegalArgumentException("File not found on S3");
        }
    }

    public void setFileStatusUploaded(ConfirmUploadRequest req) {

        StoredFile file = repository.findByKey(req.key())
                .orElseThrow(() -> new IllegalArgumentException("Unknown file"));

        file.setSize(req.size());
        file.setContentType(req.contentType());
        file.setOriginalName(req.originalFileName());
        file.setStatus(FileStatus.UPLOADED);
        file.setExpiresAt(Instant.now());

        repository.save(file);

    }
}