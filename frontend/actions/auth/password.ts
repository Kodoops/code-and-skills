"use server";

import { AxiosServerClient } from "@/lib/axiosServerClient";
import { handleAxiosError } from "@/lib/handleAxiosError";
import {TypeResponse} from "@/lib/types";


/**
 * 🔹  Changement du mot de passe depuis le compte connecté
 * Endpoint : PATCH /auth/change-password
 */
export async function changePasswordAction(values: {
    oldPassword: string;
    newPassword: string;
}): Promise<TypeResponse<null>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.patch("/auth/change-password", values);

        return {
            status: "success",
            message: res.data?.message || "Votre mot de passe a été modifié avec succès.",
            data: null,
        };
    } catch (error) {
        return handleAxiosError(error, "Erreur lors du changement de mot de passe.");
    }
}