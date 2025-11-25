"use server";

import { AxiosServerClient } from "@/lib/axiosServerClient";
import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import {Payment} from "@/models";
import {handleAxiosError} from "@/lib/handleAxiosError";


interface GetPaymentsParams {
    page?: number;
    size?: number;
    userId?: string;
    type?: string;
    status?: string;
}

export async function getPaymentsAction(
    params: GetPaymentsParams = {}
): Promise<TypeResponse<PagedResponse<Payment>>> {
    const {
        page = 0,
        size = 10,
        userId = "",
        type = "",
        status = "",
    } = params;

    try {
        const client = await AxiosServerClient();

        const res = await client.get("/billing/admin/sales", {
            params: {
                page,
                size,
                userId,
                type,
                status,
            },
        });

        const paged: PagedResponse<Payment> = res.data?.data;

        return {
            status: "success",
            message: res.data?.message || "Paiements récupérés avec succès.",
            data: paged,
        };
    } catch (error) {
        console.error("getPaymentsAction error:", error);
        return handleAxiosError<PagedResponse<Payment>>(
            error,
            "Erreur lors de la récupération des paiements."
        );
    }
}

export async function getPaymentByIdAction(
    id: string
): Promise<TypeResponse<Payment>> {
    try {
        const client = await AxiosServerClient();

        // Suppose que ton backend expose GET /payments/{id}
        const res = await client.get<ApiResponse<Payment>>(`/billing/admin/sales/${id}`);

        const payment: Payment = res.data?.data;

        return {
            status: "success",
            message: res.data?.message || "Paiement récupéré avec succès.",
            data: payment,
        };
    } catch (error) {
        console.error("getPaymentByIdAction error:", error);
        return handleAxiosError<Payment>(
            error,
            "Erreur lors de la récupération du paiement."
        );
    }
}

type DownloadInvoiceResult =
    | { ok: true; fileName: string; base64: string }
    | { ok: false; message: string };

export async function generateInvoiceForPaymentAction(paymentId: string, userId:string): Promise<DownloadInvoiceResult>  {
    try {

        const client = await AxiosServerClient();

        const response = await client.get(
            `/billing/invoices/user/${userId}/payment/${paymentId}/download`,
            {
                responseType: "arraybuffer",
            }
        );

        const fileName =
            response.headers["content-disposition"]
                ?.split("filename=")[1]
                ?.replace(/"/g, "") || "invoice.pdf";

        // ⚠️ On convertit les bytes en base64 (string)
        const base64 = Buffer.from(response.data as ArrayBuffer).toString("base64");

        return {
            ok: true,
            fileName,
            base64,
        };

    } catch (error: any) {
        console.error("Erreur downloadInvoiceAction:", error);

        return {
            ok: false,
            message:
                error?.response?.data?.message ||
                "Erreur lors du téléchargement de la facture.",
        };
    }
}


interface RefundResult {
    refundId?: string;
}

export async function refundPaymentAction(
    paymentId: string
): Promise<TypeResponse<RefundResult>> {
    try {
        const client = await AxiosServerClient();

        const res = await client.post(`/billing/admin/sales/${paymentId}/refund`);

        return {
            status: "success",
            message: res.data?.message || "Paiement remboursé avec succès.",
            data: res.data?.data,
        };
    } catch (error) {
        console.error("refundPaymentAction error:", error);
        return handleAxiosError<RefundResult>(
            error,
            "Erreur lors du remboursement du paiement."
        );
    }
}

export interface AdminSalesStats {
    totalPaid: number;      // ou string si tes BigDecimal sont sérialisés en string
    totalPending: number;
    totalFailed: number;
    totalRefunded: number;
    grandTotal: number;
}

export async function getPaymentsStatsAction(): Promise<
    TypeResponse<AdminSalesStats>
> {
    try {
        const client = await AxiosServerClient();

        const res = await client.get("/billing/admin/sales/stats");

        const stats: AdminSalesStats = res.data?.data;

        return {
            status: "success",
            message: res.data?.message || "Statistiques des paiements récupérées avec succès.",
            data: stats,
        };
    } catch (error) {
        console.error("getPaymentsStatsAction error:", error);
        return handleAxiosError<AdminSalesStats>(
            error,
            "Erreur lors de la récupération des statistiques de paiements."
        );
    }
}
