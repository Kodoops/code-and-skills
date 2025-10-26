"use server";

import { AxiosServerClient } from "@/lib/axiosServerClient";
import { ResponseType } from "@/models";
import { handleAxiosError } from "@/lib/handleAxiosError";

/**
 * 🔹 Étape 1 : Envoi du lien de réinitialisation de mot de passe
 * Endpoint : POST /auth/forgot-password
 */
export async function forgotPasswordAction(email: string): Promise<ResponseType<null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.post("/auth/forgot-password", { email });

        return {
            status: "success",
            message:
                res.data?.message ||
                res.data?.data ||
                "Un email de réinitialisation vous a été envoyé si l’adresse est valide.",
            data: null,
        };
    } catch (error) {
        return handleAxiosError(error, "Erreur lors de la demande de réinitialisation du mot de passe.");
    }
}

/**
 * 🔹 Étape 2 : Réinitialisation du mot de passe via le lien reçu par email
 * Endpoint : POST /auth/reset-password?token=...
 */
export async function resetPasswordAction(
    token: string,
    newPassword: string
): Promise<ResponseType<null>> {
    if (!token) {
        return {
            status: "error",
            message: "Token de réinitialisation manquant.",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.post(`/auth/reset-password?token=${token}`, {
            newPassword,
        });

        return {
            status: "success",
            message:
                res.data?.message ||
                res.data?.data ||
                "Votre mot de passe a été réinitialisé avec succès.",
            data: null,
        };
    } catch (error) {
        return handleAxiosError(error, "Erreur lors de la réinitialisation du mot de passe.");
    }
}
