"use server";

import { AxiosServerClient } from "@/lib/axiosServerClient";
import { UserProfile } from "@/models";
import { handleAxiosError } from "@/lib/handleAxiosError";
import {ApiResponse, TypeResponse} from "@/lib/types";

/**
 * 🔹 Récupère le profil utilisateur connecté
 */
export async function getUserProfileAction(): Promise<TypeResponse<UserProfile | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<UserProfile>>("/profiles/me");

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Impossible de récupérer le profil utilisateur.",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Profil utilisateur récupéré avec succès.",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<UserProfile>(error, "Erreur lors de la récupération du profil utilisateur.");
    }
}

/**
 * 🔧 Met à jour le profil utilisateur
 */
export async function updateProfileAction(values: {
    firstname?: string;
    lastname?: string;
    bio?: string;
    country?: string;
    city?: string;
    avatarUrl?: string;
}): Promise<TypeResponse<UserProfile | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<UserProfile>>("/profiles/me", values);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la mise à jour du profil.",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Profil mis à jour avec succès.",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<UserProfile>(error, "Erreur lors de la mise à jour du profil utilisateur.");
    }
}