package com.codeandskills.billing_service.application.mapper;

import com.codeandskills.billing_service.application.dto.PaymentDTO;
import com.codeandskills.billing_service.domain.models.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentDTO toDto(Payment payment) {
        if (payment == null) return null;

        return PaymentDTO.builder()
                .id(payment.getId())
                .userId(payment.getUserId())
                .referenceId(payment.getReferenceId())
                .type(payment.getType())
                .stripeId(payment.getStripeId())
                .stripePaymentIntentId(payment.getStripePaymentIntentId())
                .stripeRefundId(payment.getStripeRefundId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .method(payment.getMethod())
                .receiptUrl(payment.getReceiptUrl())
                .build();
    }
}