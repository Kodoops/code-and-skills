// /app/dashboard/invoices/_components/InvoicePdf
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
} from "@react-pdf/renderer";

// Exemple de logo en ligne (base64 ou URL publique)
const LOGO_URL = "http://localhost:3000/logo/code&skills-transparent.png"; // remplace par ton vrai logo
const TEXT_LOGO_URL = "http://localhost:3000//logo/CODE_SKILLS_cropped.png"; // remplace par ton vrai logo

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: "Helvetica",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },

    // En-tête
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: "1pt solid #eee",
        paddingBottom: 10,
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 80,
    },

    text_logo: {
        width: 100,
        height:24,
    },
    companyInfo: {
        textAlign: "right",
    },
    title: {
        fontSize: 22,
        textAlign: "center",
        fontWeight: "bold",
        marginVertical: 10,
    },

    // Infos facture
    infoRow: {
        marginBottom: 4,
    },

    // Tableau
    section: {
        marginVertical: 15,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottom: "1pt solid #333",
        paddingBottom: 6,
        marginBottom: 4,
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 4,
        borderBottom: "0.5pt solid #ddd",
    },
    columnTitle: {
        width: "40%",
    },
    columnType: {
        width: "20%",
    },
    columnAmount: {
        width: "40%",
        textAlign: "right",
    },
    totalRow: {
        marginTop: 20,
        textAlign: "right",
        fontSize: 14,
        fontWeight: "bold",
    },

    // Pied de page
    footer: {
        borderTop: "1pt solid #eee",
        paddingTop: 10,
        fontSize: 10,
        textAlign: "center",
        color: "#999",
    },
});

export function InvoicePdf({ invoice, company }: { invoice: any, company: any }) {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* 🧾 En-tête avec logo et entreprise */}
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Image style={styles.logo} src={LOGO_URL} />
                        <Image style={styles.text_logo} src={TEXT_LOGO_URL} />
                    </View>
                    <View style={styles.companyInfo}>
                        <Text>{company.name}</Text>
                        <Text>{company.address}</Text>
                        <Text>{company.postalCode} {company.city}, {company.contry}</Text>
                        <Text>Email : {company.email}</Text>
                        <Text>Tel : {company.phone}</Text>
                    </View>
                </View>

                {/* 🧾 Titre et infos facture */}
                <Text style={styles.title}>Facture</Text>
                <View>
                    <Text style={styles.infoRow}>Numéro : {invoice.number}</Text>
                    <Text style={styles.infoRow}>
                        Date : {new Date(invoice.createdAt).toLocaleDateString()}
                    </Text>
                    <Text style={styles.infoRow}>
                        Client : {invoice.user?.name ?? "Client inconnu"}
                    </Text>
                    <Text style={styles.infoRow}>Devise : {invoice.currency}</Text>
                </View>

                {/* 🧾 Lignes de facture */}
                <View style={styles.section}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.columnTitle}>Description</Text>
                        <Text style={styles.columnType}>Type</Text>
                        <Text style={styles.columnAmount}>Montant</Text>
                    </View>

                    {invoice.items.map((item: any, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.columnTitle}>{item.title}</Text>
                            <Text style={styles.columnType}>{item.type}</Text>
                            <Text style={styles.columnAmount}>
                                {(item.total / 100).toFixed(2)} {invoice.currency}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* 🧾 Total */}
                <Text style={styles.totalRow}>
                    Total : {(invoice.amount / 100).toFixed(2)} {invoice.currency}
                </Text>

                {/* 🧾 Pied de page */}
                <View style={styles.footer}>
                    <Text>
                        Merci pour votre confiance - {company.name} © {new Date().getFullYear()}
                    </Text>
                    <Text>SIRET {company.siret} - TVA {company.vatNumber}</Text>
                    <Text>
                        Ce document est généré automatiquement et n’a pas besoin de signature.
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
