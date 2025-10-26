"use server";

import { ApiResponse, ResponseType, Tag } from "@/models";
import { AxiosServerClient } from "@/lib/axiosServerClient";
import { handleAxiosError } from "@/lib/handleAxiosError";

/**
 * 🌍 Récupère la liste publique de tous les tags
 */
export async function publicGetTags(): Promise<ResponseType<Tag[] | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Tag[]>>(`/catalog/public/tags`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la récupération des tags publics",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Tags publics récupérés avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Tag[]>(error, "Erreur lors de la récupération des tags publics");
    }
}

/**
 * 🌍 Récupère un tag public par son slug
 */
export async function publicGetTagBySlug(slug: string): Promise<ResponseType<Tag | null>> {
    if (!slug) {
        return { status: "error", message: "Aucun slug fourni", data: null };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Tag>>(`/catalog/public/tags/${slug}`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la récupération du tag public",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Tag public récupéré avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Tag>(error, "Erreur lors de la récupération du tag public");
    }
}