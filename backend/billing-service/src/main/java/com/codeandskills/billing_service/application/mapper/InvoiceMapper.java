package com.codeandskills.billing_service.application.mapper;


import com.codeandskills.billing_service.application.dto.InvoiceDTO;
import com.codeandskills.billing_service.application.dto.InvoiceItemDTO;
import com.codeandskills.billing_service.domain.models.Invoice;
import com.codeandskills.billing_service.domain.models.InvoiceItem;
import org.springframework.stereotype.Component;

@Component
public class InvoiceMapper {

    public InvoiceItemDTO toItemDto(InvoiceItem item) {
        return new InvoiceItemDTO(
                item.getId(),
                item.getTitle(),
                item.getType().name(),
                item.getReferenceId(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getTotal()
        );
    }

    public InvoiceDTO toDto(Invoice invoice) {
        return InvoiceDTO.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .tenantId(invoice.getTenantId())
                .paymentId(invoice.getPaymentId())
                .amount(invoice.getAmount())
                .currency(invoice.getCurrency())
                .taxRate(invoice.getTaxRate())
                .taxAmount(invoice.getTaxAmount())
                .status(invoice.getStatus())
                .pdfUrl(invoice.getPdfUrl())
                .createdAt(invoice.getCreatedAt())
                .updatedAt(invoice.getUpdatedAt())
                .items(
                        invoice.getItems()
                                .stream()
                                .map(this::toItemDto)
                                .toList()
                )
                .build();
    }
}