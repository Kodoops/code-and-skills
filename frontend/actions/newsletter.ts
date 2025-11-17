"use server"

import {newsletterSchema, NewsletterSchema} from "@/lib/db/zodSchemas";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {TypeResponse} from "@/lib/types";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import { Newsletter } from "@/models";

export async function subscribeToNewsletter(values: NewsletterSchema): Promise<TypeResponse<Newsletter>> {
    const parsed = newsletterSchema.safeParse(values);

    if (!parsed.success) {
        return { status: "error", message: "Email invalide", data: null };
    }

    try {
        const client = await AxiosServerClient();
       const res =  await client.post(`/notifications/newsletter/subscribe`, values);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de l'inscription de la subscription a la newsletter",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Inscription a la newsletter avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Newsletter>(error, "Erreur lors de l'inscription de la subscription a la newsletter");
    }
}


export async function confirmNewsletterSubscription(email: string): Promise<TypeResponse<Newsletter>> {

    try {
        const client = await AxiosServerClient();
        const res =  await client.put(`/notifications/newsletter/confirm`, { email });

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la confirmation de la subscription a la newsletter ",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Inscription a la newsletter confirmée avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Newsletter>(error, "Erreur lors de la confirmation de la subscription a la newsletter");
    }
}