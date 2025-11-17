package com.codeandskills.notification_service.application.service;

import com.codeandskills.common.response.PagedResponse;
import com.codeandskills.notification_service.application.dto.ContactMessageDTO;
import com.codeandskills.notification_service.application.dto.NewsletterDTO;
import com.codeandskills.notification_service.application.mapper.NewsletterMapper;
import com.codeandskills.notification_service.domain.model.ContactMessage;
import com.codeandskills.notification_service.domain.model.Newsletter;
import com.codeandskills.notification_service.domain.repository.NewsletterRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class NewsLetterService {

    private final NewsletterRepository newsletterRepository;
    private final NewsletterMapper newsletterMapper;
    private final MailService mailService;

    @Value("${app.frontendUrl}")
    private String frontendUrl;

    public NewsLetterService(NewsletterRepository newsletterRepository, NewsletterMapper newsletterMapper, MailService mailService) {
        this.newsletterRepository = newsletterRepository;
        this.newsletterMapper = newsletterMapper;
        this.mailService = mailService;
    }

    public NewsletterDTO subscribe(String email, String name) {
        Optional<Newsletter> founded = newsletterRepository.findByEmail(email);
        if (founded.isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        Newsletter newsletter = new Newsletter();
        newsletter.setEmail(email);
        newsletter.setName(name);
        newsletter.setConfirmed(false);

        Newsletter saved = newsletterRepository.save(newsletter);

        // Send Email to User
        Map<String, Object> variables = new java.util.HashMap<>();
        variables.put("userName", name);
        variables.put("verificationLink", frontendUrl + "/pages/newsletter/confirm?email=" + saved.getEmail());

        mailService.sendEmail(email, "Newsletter Subscription", "newsletter-subscription", variables);

        return newsletterMapper.toDto(saved);
    }

    public NewsletterDTO confirm(String email) {
        Optional<Newsletter> founded = newsletterRepository.findByEmail(email);
        if (founded.isEmpty()) {
            throw new IllegalArgumentException("Email not registered yet");
        }

        Newsletter newsletter = founded.get();
        newsletter.setConfirmed(true);
        newsletterRepository.save(newsletter);

        // Send Email to User
        Map<String, Object> variables = new java.util.HashMap<>();
        variables.put("userName", newsletter.getName());
        variables.put("profileLink", frontendUrl + "/dashboard");

        mailService.sendEmail(email, "Newsletter Subscription Confirmation", "newsletter-confirmation", variables);

        return newsletterMapper.toDto(newsletter);
    }

    public PagedResponse<NewsletterDTO> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Newsletter> resultPage = newsletterRepository.findAll(pageable);

        List<NewsletterDTO> content = resultPage.getContent()
                .stream()
                .map(newsletterMapper::toDto)
                .toList();

        return new PagedResponse<>(
                content,
                resultPage.getNumber(),
                resultPage.getTotalPages(),
                resultPage.getSize(),
                resultPage.getTotalElements()
        );
    }

    public PagedResponse<NewsletterDTO> getByStatus(boolean confirmed, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Newsletter> resultPage = null;
        if (confirmed) {
            resultPage = newsletterRepository.findByConfirmedIsTrue(pageable);
        } else {
            resultPage = newsletterRepository.findByConfirmedIsFalse(pageable);
        }

        List<NewsletterDTO> content = resultPage.getContent()
                .stream()
                .map(newsletterMapper::toDto)
                .toList();

        return new PagedResponse<>(
                content,
                resultPage.getNumber(),
                resultPage.getTotalPages(),
                resultPage.getSize(),
                resultPage.getTotalElements()
        );
    }

    public void deleteNewsletter(String id) {
        newsletterRepository.deleteById(id);
    }

    public NewsletterDTO getByEmail(String email) {
        Optional<Newsletter> newsletter = newsletterRepository.findByEmail(email);

        if(newsletter.isEmpty ()) {
            throw new IllegalArgumentException("Email not registered yet");
        }

        return newsletterMapper.toDto(newsletter.get()) ;
    }

    public void deleteByEmail(String email) {
        Optional<Newsletter> newsletter = newsletterRepository.findByEmail(email);

        if(newsletter.isEmpty ()) {
            throw new IllegalArgumentException("Email not registered yet");
        }

         newsletterRepository.delete(newsletter.get());

        // Send Email to User
        Map<String, Object> variables = new java.util.HashMap<>();
        variables.put("userName", newsletter.get().getName ());
        variables.put("profileLink", frontendUrl + "/dashboard");

        mailService.sendEmail(email, "Newsletter unsubscription Confirmation", "newsletter-unsubscription", variables);
    }
}
