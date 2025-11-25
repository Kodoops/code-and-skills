"use server"

import {requireUser} from "@/actions/auth/requireUser";
import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import {Course, Invoice} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {INVOICES_PER_PAGE} from "@/constants/user-contants";
import {notFound} from "next/navigation";

export async function getUserInvoices(
    page: number = 1,
    size= INVOICES_PER_PAGE,
    state=""
): Promise<TypeResponse<PagedResponse<Invoice>>> {
    const user = await requireUser();
    if(!user)
        return notFound();

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Invoice>>>(`/billing/invoices/user/${user?.userId}`,
            { params: { page, size, state } }
            );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération du cours",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Cours récupéré avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<Invoice>>(error, "Erreur lors de la récupération du cours");
    }

}

type DownloadInvoiceResult =
    | { ok: true; fileName: string; base64: string }
    | { ok: false; message: string };

export async function downloadInvoice(invoiceId: string): Promise<DownloadInvoiceResult>  {
    try {
        const user = await requireUser();
        if(!user)
            return notFound();

        const client = await AxiosServerClient();

        const response = await client.get(
            `/billing/invoices/user/${user.userId}/${invoiceId}/download`,
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
