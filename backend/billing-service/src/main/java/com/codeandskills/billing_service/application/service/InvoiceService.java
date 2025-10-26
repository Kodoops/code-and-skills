package com.codeandskills.billing_service.application.service;

import com.codeandskills.billing_service.domain.models.Invoice;
import com.codeandskills.billing_service.domain.models.InvoiceStatus;
import com.codeandskills.billing_service.domain.models.Payment;
import com.codeandskills.billing_service.domain.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PdfGenerator pdfGenerator; // service interne pour créer un PDF

    public Invoice generateFromPayment(Payment payment) {
        String invoiceNumber = "INV-" + System.currentTimeMillis();

        Invoice invoice = Invoice.builder()
                .tenantId(payment.getUserId())
                .paymentId(payment.getId())
                .invoiceNumber(invoiceNumber)
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .taxRate(0.20)
                .taxAmount(payment.getAmount() * 0.20)
                .status(InvoiceStatus.GENERATED)
                .build();

        // Générer le PDF et uploader sur S3 (ou local)
        String pdfUrl = pdfGenerator.generateInvoicePdf(invoice);
        invoice.setPdfUrl(pdfUrl);

        invoiceRepository.save(invoice);
        log.info("📄 Facture générée pour paiement {}", payment.getId());

        return invoice;
    }
}