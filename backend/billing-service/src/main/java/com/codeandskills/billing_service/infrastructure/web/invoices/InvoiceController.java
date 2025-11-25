package com.codeandskills.billing_service.infrastructure.web.invoices;

import com.codeandskills.billing_service.application.dto.InvoiceDTO;
import com.codeandskills.billing_service.application.service.InvoiceService;
import com.codeandskills.billing_service.application.service.PdfGenerator;
import com.codeandskills.billing_service.domain.models.Invoice;
import com.codeandskills.billing_service.domain.models.Payment;
import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/billing/invoices")
@RequiredArgsConstructor
@Slf4j
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final PdfGenerator pdfGenerator;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<PagedResponse<InvoiceDTO>>> getAllUserInvoices(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "", required = false) String status
    ) {
        PagedResponse<InvoiceDTO> pagedResponse =
                invoiceService.getUserInvoices(userId, page, size, status);

        return ResponseEntity.ok(
                ApiResponse.success(200, "📦 Invoices  récupérés avec succès", pagedResponse)
        );
    }

    @GetMapping("/user/{userId}/{invoiceId}/download")
    public ResponseEntity<byte[]> downloadInvoice(
            @PathVariable String invoiceId,
            @PathVariable String userId
    ) throws Exception {

        // 1) Récupérer la facture + vérifier que l'utilisateur y a droit
        Invoice invoice = invoiceService.getInvoiceForUser(invoiceId, userId);

        // 2) Générer le PDF (si tu fais génération à la demande)
        byte[] pdfBytes = pdfGenerator.generate(invoice);

        // 3) Construire la réponse HTTP
        String fileName = invoice.getInvoiceNumber() + ".pdf";

        return ResponseEntity
                .ok()
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .header(
                        org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\""
                )
                .contentLength(pdfBytes.length)
                .body(pdfBytes);
    }

    @GetMapping("/user/{userId}/payment/{paymentId}/download")
    public ResponseEntity<byte[]> downloadPaymentInvoice(
            @PathVariable String paymentId,
            @PathVariable String userId
    ) throws Exception {

        // 1) Récupérer la facture + vérifier que l'utilisateur y a droit
        Invoice invoice = invoiceService.getInvoiceForUserWithPaymentId(paymentId, userId);

        // 2) Générer le PDF (si tu fais génération à la demande)
        byte[] pdfBytes = pdfGenerator.generate(invoice);

        // 3) Construire la réponse HTTP
        String fileName = invoice.getInvoiceNumber() + ".pdf";

        return ResponseEntity
                .ok()
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .header(
                        org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\""
                )
                .contentLength(pdfBytes.length)
                .body(pdfBytes);
    }
}
