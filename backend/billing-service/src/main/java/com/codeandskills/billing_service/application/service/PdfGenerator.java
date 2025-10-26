package com.codeandskills.billing_service.application.service;

import com.codeandskills.billing_service.domain.models.Invoice;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.awt.Color;

@Service
@Slf4j
public class PdfGenerator {

    private static final String OUTPUT_DIR = "invoices/";

    public String generateInvoicePdf(Invoice invoice) {
        try {
            File dir = new File(OUTPUT_DIR);
            if (!dir.exists()) dir.mkdirs();

            String filePath = OUTPUT_DIR + "invoice-" + invoice.getInvoiceNumber() + ".pdf";

            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();

            // --- HEADER ---
            addHeader(document, invoice);

            // --- TABLE FACTURE ---
            addInvoiceTable(document, invoice);

            // --- TOTAL ---
            addTotals(document, invoice);

            document.close();
            log.info("📄 Facture PDF générée : {}", filePath);
            return filePath;

        } catch (Exception e) {
            log.error("❌ Erreur génération facture PDF : {}", e.getMessage(), e);
            throw new RuntimeException("Erreur de génération PDF", e);
        }
    }

    private void addHeader(Document document, Invoice invoice) throws DocumentException, IOException {
        Paragraph header = new Paragraph("FACTURE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20));
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);
        document.add(Chunk.NEWLINE);

        Paragraph info = new Paragraph("CodeAndSkills\nEmail: contact@codeandskills.com\n",
                FontFactory.getFont(FontFactory.HELVETICA, 10));
        info.setAlignment(Element.ALIGN_LEFT);
        document.add(info);
        document.add(Chunk.NEWLINE);

        Paragraph invoiceInfo = new Paragraph(
                String.format("Facture n° %s\nDate : %s\nClient ID : %s\n",
                        invoice.getInvoiceNumber(),
                        invoice.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                        invoice.getTenantId()),
                FontFactory.getFont(FontFactory.HELVETICA, 11));
        invoiceInfo.setAlignment(Element.ALIGN_LEFT);
        document.add(invoiceInfo);
        document.add(Chunk.NEWLINE);
    }

    private void addInvoiceTable(Document document, Invoice invoice) throws DocumentException {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{4, 1, 2, 2});

        addTableHeader(table, "Description", "Qté", "Prix unitaire", "Montant");

        addTableRow(table,
                invoice.getDescription() != null ? invoice.getDescription() : "Abonnement CodeAndSkills",
                "1",
                formatAmount(invoice.getAmount()),
                formatAmount(invoice.getAmount())
        );

        document.add(table);
        document.add(Chunk.NEWLINE);
    }

    private void addTotals(Document document, Invoice invoice) throws DocumentException {
        double totalTTC = invoice.getAmount() + (invoice.getTaxAmount() != null ? invoice.getTaxAmount() : 0);
        Paragraph totals = new Paragraph(
                String.format("""
                Sous-total : %s %s
                TVA (%.0f%%) : %s %s
                Total TTC : %s %s
                """,
                        formatAmount(invoice.getAmount()), invoice.getCurrency(),
                        invoice.getTaxRate() != null ? invoice.getTaxRate() * 100 : 0,
                        formatAmount(invoice.getTaxAmount() != null ? invoice.getTaxAmount().intValue() : 0),
                        invoice.getCurrency(),
                        formatAmount((int) totalTTC), invoice.getCurrency()),
                FontFactory.getFont(FontFactory.HELVETICA, 11)
        );
        totals.setAlignment(Element.ALIGN_RIGHT);
        document.add(totals);
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(Color.LIGHT_GRAY);
            table.addCell(cell);
        }
    }

    private void addTableRow(PdfPTable table, String desc, String qty, String unit, String total) {
        table.addCell(desc);
        table.addCell(qty);
        table.addCell(unit);
        table.addCell(total);
    }

    private String formatAmount(int amount) {
        return String.format("%.2f", amount / 100.0); // si tu stockes en centimes
    }
}