"use server";

import { ApiResponse, PagedResponse, ResponseType, Tag } from "@/models";
import { AxiosServerClient } from "@/lib/axiosServerClient";
import { revalidatePath } from "next/cache";
import { handleAxiosError } from "@/lib/handleAxiosError";

/**
 * 🔹 Récupère la liste paginée des tags (admin)
 */
export async function adminGetTagsPaginated(
    page = 0,
    size = 10
): Promise<ResponseType<PagedResponse<Tag>>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Tag>>>(
            `/catalog/admin/tags`,
            { params: { page, size } }
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des tags paginés",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Tags récupérés avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<Tag>>(error, "Erreur lors de la récupération des tags paginés");
    }
}

/**
 * 🔹 Récupère la liste complète des tags (admin)
 */
export async function adminGetAllTags(): Promise<ResponseType<Tag[] | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Tag[]>>(`/catalog/admin/tags/all`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des tags",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Tags récupérés avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Tag[]>(error, "Erreur lors de la récupération des tags");
    }
}


/**
 * 🔹 Récupère un tag par son ID (admin)
 */
export async function adminGetTagById(id: string): Promise<ResponseType<Tag | null>> {
    if (!id) {
        return { status: "error", message: "ID du tag manquant", data: null };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Tag>>(`/catalog/admin/tags/${id}`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération du tag",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Tag récupéré avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Tag>(error, "Erreur lors de la récupération du tag");
    }
}

/**
 * 🔧 Crée un nouveau tag (admin)
 */
export async function adminCreateTag(payload: Partial<Tag>): Promise<ResponseType<Tag | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<Tag>>(`/catalog/admin/tags`, payload);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la création du tag",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Tag créé avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Tag>(error, "Erreur lors de la création du tag");
    }
}

/**
 * 🔧 Met à jour un tag existant (admin)
 */
export async function adminUpdateTag(
    id: string,
    payload: Partial<Tag>
): Promise<ResponseType<Tag | null>> {
    if (!id) {
        return { status: "error", message: "ID du tag manquant", data: null };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<Tag>>(`/catalog/admin/tags/${id}`, payload);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la mise à jour du tag",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Tag mis à jour avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Tag>(error, "Erreur lors de la mise à jour du tag");
    }
}

/**
 * ❌ Supprime un tag (admin)
 */
export async function adminDeleteTag(id: string): Promise<ResponseType<null>> {
    if (!id) {
        return { status: "error", message: "ID du tag manquant", data: null };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<void>>(`/catalog/admin/tags/${id}`);

        revalidatePath("/admin/tags");

        return {
            status: "success",
            message: res.data?.message || "Tag supprimé avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<null>(error, "Erreur lors de la suppression du tag");
    }
}