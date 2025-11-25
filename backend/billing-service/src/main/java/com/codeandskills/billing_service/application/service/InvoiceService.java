package com.codeandskills.billing_service.application.service;

import com.codeandskills.billing_service.application.dto.InvoiceDTO;
import com.codeandskills.billing_service.application.mapper.InvoiceMapper;
import com.codeandskills.billing_service.domain.models.Invoice;
import com.codeandskills.billing_service.domain.models.InvoiceItem;
import com.codeandskills.billing_service.domain.models.InvoiceStatus;
import com.codeandskills.billing_service.domain.models.Payment;
import com.codeandskills.billing_service.domain.repository.InvoiceRepository;
import com.codeandskills.billing_service.infrastructure.client.FileServiceClient;
import com.codeandskills.billing_service.infrastructure.dto.InternalFileUploadRequest;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {


    private final InvoiceRepository invoiceRepository;
    // private final PdfGenerator pdfGenerator; // service interne pour créer un PDF
    private final InvoiceMapper invoiceMapper;
   // private final FileServiceClient fileServiceClient;

    public Invoice generateFromPayment(Payment payment) {
        String invoiceNumber = "INV-" + System.currentTimeMillis();

        double taxRate = 0.20; // 20%
        long totalTtcCents = payment.getAmount().longValue();              // 💰 déjà BigDecimal j’espère

        // ✅ HT = TTC / (1 + taux)
        long htCents = Math.round(totalTtcCents / (1 + taxRate));

        // ✅ TVA = TTC - HT
        double taxCents = totalTtcCents - htCents;

        Invoice invoice = Invoice.builder()
                .tenantId(payment.getUserId())               // à adapter si tenant ≠ user
                .paymentId(payment.getId())
                .invoiceNumber(invoiceNumber)
                .amount(BigDecimal.valueOf(totalTtcCents))
                .currency(payment.getCurrency())
                .taxRate(taxRate)
                .taxAmount(taxCents)
                .status(InvoiceStatus.PAID)
                .build();

        // 🧾 Création d’un seul item pour un achat de course
        InvoiceItem item = InvoiceItem.builder()
                .invoice(invoice)                            // ou via invoice.addItem(item)
                .title(payment.getType().toString() + " : " + payment.getReferenceId()) // tu peux aussi injecter le vrai titre du cours
                .type(payment.getType())                    // "COURSE"
                .referenceId(payment.getReferenceId())      // courseId
                .quantity(1)
                .unitPrice(BigDecimal.valueOf(totalTtcCents))
                .total(BigDecimal.valueOf(totalTtcCents))
                .build();

        invoice.addItem(item);

        // Générer le PDF et uploader sur S3 (ou local)
//        String pdfUrl = pdfGenerator.generateInvoicePdf(invoice);
//        invoice.setPdfUrl(pdfUrl);
//
//        invoiceRepository.save(invoice);
//        log.info("📄 Facture générée pour paiement {}", payment.getId());

        // 1️⃣ On sauve une première fois (pour avoir un ID si besoin)
        invoice = invoiceRepository.save(invoice);
//
//        // 2️⃣ Génération du PDF
//        byte[] pdfBytes = pdfGenerator.generate(invoice);
//
//        // 3️⃣ Encodage base64 pour envoi à file-service
//        String base64 = Base64.getEncoder().encodeToString(pdfBytes);
//
//        var uploadReq = new InternalFileUploadRequest(
//                invoiceNumber + ".pdf",
//                "invoices",
//                "application/pdf",
//                base64
//        );
//
//        var uploadRes = fileServiceClient.uploadInvoice(uploadReq);
//
//        // 4️⃣ On stocke key / url
//        invoice.setPdfUrl(uploadRes.getUrl());
//        // ou un champ pdfKey = uploadRes.getKey();
//        invoice = invoiceRepository.save(invoice);
  //      log.info("📄 Facture générée pour paiement {} et uploadée sous {}", payment.getId(), uploadRes.getKey());

        return invoice;
    }

    public PagedResponse<InvoiceDTO> getUserInvoices(String userId, int page, int size, String status) {
        Page<Invoice> invoices = null;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        if (status.isEmpty() || status.equals("ALL")) {
            invoices = invoiceRepository.findByTenantId(userId, pageable);
        } else {
            invoices = invoiceRepository.findByTenantIdAndStatus(userId, InvoiceStatus.valueOf(status.toUpperCase()), pageable);
        }
        return PagedResponse.<InvoiceDTO>builder()
                .content(invoices.getContent().stream().map(invoiceMapper::toDto).toList())
                .currentPage(invoices.getNumber())
                .perPage(invoices.getSize())
                .totalElements(invoices.getTotalElements())
                .totalPages(invoices.getTotalPages())
                .build();
    }

    public Invoice getInvoiceForUser(String id, String userId) {
        Optional<Invoice> byIdAndTenantId = invoiceRepository.findByIdAndTenantId(id, userId);
        if (byIdAndTenantId.isPresent()) {
            return byIdAndTenantId.get();
        }
        throw new IllegalArgumentException("Invoice bot found.");
    }

    public Invoice getInvoiceForUserWithPaymentId(String paymentId, String userId) {
        Optional<Invoice> byIdAndTenantId = invoiceRepository.findByPaymentIdAndTenantId(paymentId, userId);
        if (byIdAndTenantId.isPresent()) {
            return byIdAndTenantId.get();
        }
        throw new IllegalArgumentException("Invoice bot found.");
    }
}