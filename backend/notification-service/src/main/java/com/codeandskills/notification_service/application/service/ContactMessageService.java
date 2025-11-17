package com.codeandskills.notification_service.application.service;

import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.notification_service.application.dto.ContactMessageDTO;
import com.codeandskills.notification_service.application.dto.ContactReplyDTO;
import com.codeandskills.notification_service.application.mapper.ContactMessageMapper;
import com.codeandskills.notification_service.application.mapper.ContactReplyMapper;
import com.codeandskills.notification_service.domain.model.ContactMessage;
import com.codeandskills.notification_service.domain.model.ContactReply;
import com.codeandskills.notification_service.domain.repository.ContactMessageRepository;
import com.codeandskills.notification_service.domain.repository.ContactReplyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ContactMessageService {

    @Value("${app.frontendUrl}")
    private String frontendUrl;

    private final ContactMessageRepository contactMessageRepository;
    private final ContactReplyRepository contactReplyRepository;
    private final ContactMessageMapper contactMessageMapper;
    private final ContactReplyMapper contactReplyMapper;
    private final MailService mailService;

    public ContactMessageDTO createMessage(ContactMessageDTO dto) {
        ContactMessage entity = contactMessageMapper.toEntity(dto);

        // On peut forcer un statut par défaut
        if (entity.getStatus() == null) {
            entity.setStatus("NEW");
        }

        ContactMessage saved = contactMessageRepository.save(entity);
        log.info("📩 Nouveau message de contact créé: id={}, email={}", saved.getId(), saved.getEmail());

        // Send Email to User
        Map<String, Object> variables = new java.util.HashMap<>();
        variables.put("userName", saved.getName());
        variables.put("profileLink", frontendUrl + "/pages/newsletter/confirm?email=" + saved.getEmail());
        variables.put("sujet", saved.getSubject());
        variables.put("message", saved.getMessage());

        mailService.sendEmail(saved.getEmail(), "Envoi de message :  "+saved.getSubject(), "contact-message", variables);

        return contactMessageMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ContactMessageDTO> getAll() {
        return contactMessageRepository.findAll()
                .stream()
                .map(contactMessageMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PagedResponse<ContactMessageDTO> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<ContactMessage> resultPage = contactMessageRepository.findAll(pageable);

        List<ContactMessageDTO> content = resultPage.getContent()
                .stream()
                .map(contactMessageMapper::toDto)
                .toList();

        return new PagedResponse<>(
                content,
                resultPage.getNumber(),
                resultPage.getTotalPages(),
                resultPage.getSize(),
                resultPage.getTotalElements()
        );

    }


    @Transactional(readOnly = true)
    public List<ContactMessageDTO> getByStatus(String status) {
        return contactMessageRepository.findByStatus(status)
                .stream()
                .map(contactMessageMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PagedResponse<ContactMessageDTO> getByStatus(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<ContactMessage> resultPage = contactMessageRepository.findByStatus(status, pageable);

        List<ContactMessageDTO> content = resultPage.getContent()
                .stream()
                .map(contactMessageMapper::toDto)
                .toList();

        return new PagedResponse<>(
                content,
                resultPage.getNumber(),
                resultPage.getTotalPages(),
                resultPage.getSize(),
                resultPage.getTotalElements()
        );

    }

    @Transactional(readOnly = true)
    public ContactMessageDTO getById(String id) {
        ContactMessage entity = contactMessageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ContactMessage introuvable pour id=" + id));
        return contactMessageMapper.toDto(entity);
    }

    public ContactMessageDTO updateStatus(String id, String status) {
        ContactMessage entity = contactMessageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ContactMessage introuvable pour id=" + id));

        entity.setStatus(status);
        ContactMessage saved = contactMessageRepository.save(entity);
        log.info("✏️ Statut du contactMessage {} mis à jour: {}", id, status);
        return contactMessageMapper.toDto(saved);
    }

    public ContactMessageDTO addReply(String contactMessageId, ContactReplyDTO replyDto) {
        ContactMessage message = contactMessageRepository.findById(contactMessageId)
                .orElseThrow(() -> new EntityNotFoundException("ContactMessage introuvable pour id=" + contactMessageId));

        ContactReply reply = contactReplyMapper.toEntity(replyDto, message);

        ContactReply savedReply = contactReplyRepository.save(reply);

        // Optionnel: mettre le status à ANSWERED
        if (!"CLOSED".equalsIgnoreCase(message.getStatus())) {
            message.setStatus("ANSWERED");
            contactMessageRepository.save(message);
        }

        log.info("📨 Réponse ajoutée au contactMessage {} par admin {}", contactMessageId, savedReply.getAdminId());

        // On renvoie le message avec ses replies à jour
        // (JPA mettra à jour la relation ; sinon on peut recharger)
        ContactMessage reloaded = contactMessageRepository.findById(contactMessageId)
                .orElseThrow(() -> new EntityNotFoundException("ContactMessage introuvable après update pour id=" + contactMessageId));

        return contactMessageMapper.toDto(reloaded);
    }

    public PagedResponse<ContactMessageDTO> getByUserId(String id, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ContactMessage> resultPage = contactMessageRepository.findByUserId(id, pageable);

        List<ContactMessageDTO> content = resultPage.getContent()
                .stream()
                .map(contactMessageMapper::toDto)
                .toList();

        return new PagedResponse<>(
                content,
                resultPage.getNumber(),
                resultPage.getTotalPages(),
                resultPage.getSize(),
                resultPage.getTotalElements()
        );
    }

    public PagedResponse<ContactMessageDTO> getByStatusAndUserId(String status, String id, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ContactMessage> resultPage = contactMessageRepository.findByStatusAndUserId(status, id, pageable);

        List<ContactMessageDTO> content = resultPage.getContent()
                .stream()
                .map(contactMessageMapper::toDto)
                .toList();

        return new PagedResponse<>(
                content,
                resultPage.getNumber(),
                resultPage.getTotalPages(),
                resultPage.getSize(),
                resultPage.getTotalElements()
        );
    }

    public void deleteUserMessage(String userId, String id) {

        Optional<ContactMessage> message = contactMessageRepository.findByIdAndUserId(id, userId);
        if (message.isEmpty()) {
            throw new IllegalArgumentException("ContactMessage introuvable ");
        }

        contactMessageRepository.delete(message.get());
    }

    public ContactMessageDTO archiveUserMessage(String userId, String id) {

        Optional<ContactMessage> message = contactMessageRepository.findByIdAndUserId(id, userId);
        if (message.isEmpty()) {
            throw new IllegalArgumentException("ContactMessage introuvable ");
        }

        message.get().setStatus("CLOSED");

        ContactMessage saved = contactMessageRepository.save(message.get());
        return contactMessageMapper.toDto(saved);
    }
}