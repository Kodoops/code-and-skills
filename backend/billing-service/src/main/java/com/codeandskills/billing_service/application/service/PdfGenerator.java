package com.codeandskills.billing_service.application.service;

import com.codeandskills.billing_service.application.dto.CompanyDTO;
import com.codeandskills.billing_service.application.dto.UserProfileDTO;
import com.codeandskills.billing_service.domain.models.Invoice;

import com.codeandskills.billing_service.domain.models.InvoiceItem;
import com.codeandskills.billing_service.infrastructure.client.CompanyClient;
import com.codeandskills.billing_service.infrastructure.client.GetPublicUserProfile;
import com.codeandskills.billing_service.infrastructure.client.UserProfileClient;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.awt.Color;
import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
public class PdfGenerator {

    private final UserProfileClient userProfileClient;
    private final CompanyClient companyClient;

    private BigDecimal centsToEuro(long cents) {
        return BigDecimal.valueOf(cents)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    private String formatMoney(BigDecimal amount, String currency) {
        // Simple, propre : "18.00 EUR"
        return amount.setScale(2, RoundingMode.HALF_UP).toPlainString() + " " + currency;
    }

    public byte[] generate(Invoice invoice) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter.getInstance(document, baos);

            document.open();

            // =========================
            // 1) En-tête : logo + infos société
            // =========================

            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{2f, 3f});

            // Colonne gauche : Logo (optionnel)
            PdfPCell logoCell = new PdfPCell();
            logoCell.setBorder(Rectangle.NO_BORDER);

            CompanyDTO companyDto = companyClient.getCompanyPublicInfos();

            try {
                Image logo;
                if(companyDto.getLogoUrl() != null && !companyDto.getLogoUrl().isBlank()) {
                     logo =Image.getInstance(companyDto.getLogoUrl());
                }else {
                     logo = Image.getInstance("classpath:static/logo.png");
                }
                logo.scaleToFit(120, 60);
                logoCell.addElement(logo);
                Paragraph logoText = new Paragraph(companyDto.getName(),
                        FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12));
                logoCell.addElement(logoText);
            } catch (Exception e) {
                // Fallback texte si pas de logo
                logoCell.addElement(new Paragraph(companyDto.getName(),
                        FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
            }

            headerTable.addCell(logoCell);

            // Colonne droite : Coordonnées entreprise
            PdfPCell companyCell = new PdfPCell();
            companyCell.setBorder(Rectangle.NO_BORDER);
            companyCell.setHorizontalAlignment(Element.ALIGN_RIGHT);


            companyCell.addElement(new Paragraph(companyDto.getName(),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            companyCell.addElement(new Paragraph(companyDto.getAddress()));
            companyCell.addElement(new Paragraph(companyDto.getPostalCode() +" " + companyDto.getCity() + ", " + companyDto.getCountry()));
            companyCell.addElement(new Paragraph("Email : " + companyDto.getEmail()));
            companyCell.addElement(new Paragraph("Tel : " + companyDto.getPhone()));
            companyCell.addElement(new Paragraph("SIRET : " + companyDto.getSiret()));
            companyCell.addElement(new Paragraph("TVA Int. : " + companyDto.getVatNumber()));

            headerTable.addCell(companyCell);

            document.add(headerTable);

            document.add(Chunk.NEWLINE);

            // =========================
            // 2) Titre facture + méta
            // =========================

            Paragraph title = new Paragraph(
                    "FACTURE " + invoice.getInvoiceNumber(),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)
            );
            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);

            document.add(Chunk.NEWLINE);


            // 1) Statut en string
            String invoiceStatus = invoice.getStatus().name();
            String status = invoiceStatus;
            switch (invoiceStatus) {
                case "PENDING": status = "En attente"; break;
                case "PAID" : status = "Payée"; break;
                case "CANCELED" : status ="Annulée"; break;
                case "REFUNDED" : status ="Remboursée"; break;
            }
            // 2) text color
            // 3) Création du paragraphe de statut
            Paragraph statusParagraph = new Paragraph(
                    "STATUT : " + status,
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)
            );
            // 4) Ajouter un encadré
            PdfPTable statusTable = new PdfPTable(1);
            statusTable.setWidthPercentage(50);
            PdfPCell cell = new PdfPCell(statusParagraph);
            cell.setPadding(8);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBorderWidth(1);             // épaisseur bordure
            statusTable.addCell(cell);
            // 5) Ajouter au document
            document.add(statusTable);
            document.add(Chunk.NEWLINE);

            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setWidths(new float[]{1.5f, 2.5f});

            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm", Locale.FRANCE);

            metaTable.addCell(noBorderCell("Date :"));
            metaTable.addCell(noBorderCell(invoice.getCreatedAt() != null ? invoice.getCreatedAt().format(fmt) : ""));

            metaTable.addCell(noBorderCell("ID paiement :"));
            metaTable.addCell(noBorderCell(invoice.getPaymentId()));

            metaTable.addCell(noBorderCell("Client (tenantId) :"));
            metaTable.addCell(noBorderCell(invoice.getTenantId()));

            document.add(metaTable);

            document.add(Chunk.NEWLINE);

            // =========================
            // 3) Bloc Client (simple pour l’instant)
            //    plus tard tu pourras enrichir avec le vrai profil client
            // =========================

            UserProfileDTO profileDto = userProfileClient.getUserProfileById(new GetPublicUserProfile(invoice.getTenantId()));

            Paragraph clientBlock = new Paragraph();
            clientBlock.add(new Chunk("Facturé à :\n",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            clientBlock.add(new Chunk(" Reférence client : " + invoice.getTenantId() + "\n"));

            clientBlock.add(new Chunk("Nom du client: " + profileDto.getFirstname() + " " + profileDto.getLastname() + "\n"));
            clientBlock.add(new Chunk("Email du client: " + profileDto.getEmail()  + "\n"));
            // TODO : si tu as le nom complet / société / adresse du client, ajoute-les ici

            document.add(clientBlock);

            document.add(Chunk.NEWLINE);

            // =========================
            // 4) Tableau des items
            // =========================

            if (invoice.getItems() != null && !invoice.getItems().isEmpty()) {
                PdfPTable itemsTable = new PdfPTable(5);
                itemsTable.setWidthPercentage(100);
                itemsTable.setWidths(new float[]{3f, 1.3f, 1.5f, 1f, 1.5f});

                Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);

                itemsTable.addCell(headerCell("Désignation", headerFont));
                itemsTable.addCell(headerCell("Type", headerFont));
                itemsTable.addCell(headerCell("Référence", headerFont));
                itemsTable.addCell(headerCell("Qté", headerFont));
                itemsTable.addCell(headerCell("Total TTC", headerFont));

                Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

                for (InvoiceItem item : invoice.getItems()) {

                    BigDecimal itemTotalEuro = centsToEuro(item.getTotal().longValue());

                    itemsTable.addCell(bodyCell(item.getTitle(), cellFont));
                    itemsTable.addCell(bodyCell(item.getType().name(), cellFont));
                    itemsTable.addCell(bodyCell(item.getReferenceId(), cellFont));
                    itemsTable.addCell(bodyCell(String.valueOf(item.getQuantity()), cellFont));
                    itemsTable.addCell(bodyCell(
                            formatMoney(itemTotalEuro, invoice.getCurrency()),
                            cellFont,
                            Element.ALIGN_RIGHT
                    ));
                }

                document.add(itemsTable);
            }

            document.add(Chunk.NEWLINE);

            // =========================
            // 5) Totaux : HT / TVA / TTC
            // =========================

            BigDecimal ttc = centsToEuro(invoice.getAmount().longValue()); // amount = TTC (en centimes)
            BigDecimal taxRate = BigDecimal.valueOf(invoice.getTaxRate()); // ex: 0.10
            BigDecimal ht = ttc.divide(BigDecimal.ONE.add(taxRate), 2, RoundingMode.HALF_UP);
            BigDecimal taxAmount = ttc.subtract(ht);

            PdfPTable totalsTable = new PdfPTable(2);
            totalsTable.setWidthPercentage(50);
            totalsTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalsTable.setWidths(new float[]{1.5f, 1.5f});

            Font bold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);

            totalsTable.addCell(noBorderRightCell("Montant HT :", bold));
            totalsTable.addCell(noBorderRightCell(formatMoney(ht, invoice.getCurrency()), bold));

            totalsTable.addCell(noBorderRightCell("TVA (" + taxRate.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP) + "%) :", bold));
            totalsTable.addCell(noBorderRightCell(formatMoney(taxAmount, invoice.getCurrency()), bold));

            totalsTable.addCell(noBorderRightCell("Montant TTC :", bold));
            totalsTable.addCell(noBorderRightCell(formatMoney(ttc, invoice.getCurrency()), bold));

            document.add(totalsTable);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            // =========================
            // 6) Pied de page simple
            // =========================

            Paragraph footer = new Paragraph(
                    "Merci pour votre confiance.\n" +
                            "Cette facture a été générée automatiquement par Code&Skills.",
                    FontFactory.getFont(FontFactory.HELVETICA, 9)
            );
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Erreur génération PDF pour invoice {} : {}", invoice.getInvoiceNumber(), e.getMessage(), e);
            throw new IllegalStateException("Erreur génération PDF", e);
        }
    }

    // =========================
    // Helpers pour les cellules
    // =========================

    private PdfPCell noBorderCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text));
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

    private PdfPCell noBorderRightCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        return cell;
    }

    private PdfPCell headerCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBackgroundColor(Color.LIGHT_GRAY);
        return cell;
    }

    private PdfPCell bodyCell(String text, Font font) {
        return bodyCell(text, font, Element.ALIGN_LEFT);
    }

    private PdfPCell bodyCell(String text, Font font, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(align);
        return cell;
    }
}