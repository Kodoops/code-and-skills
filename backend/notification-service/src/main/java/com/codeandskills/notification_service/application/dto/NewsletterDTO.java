package com.codeandskills.notification_service.application.dto;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class NewsletterDTO  {
        String id;
        String email;
        String name;
        boolean confirmed;

}
