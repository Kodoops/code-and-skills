"use server";

import { AxiosServerClient } from "@/lib/axiosServerClient";
import { ApiResponse, PagedResponse, ResponseType, Category } from "@/models";
import { CategorySchema } from "@/lib/db/zodSchemas";
import { handleAxiosError } from "@/lib/handleAxiosError";

/**
 * 🔹 Récupère la liste paginée des catégories
 */
export async function adminGetCategories({
                                             page = 0,
                                             size = 10,
                                         }: {
    page?: number;
    size?: number;
} = {}): Promise<ResponseType<PagedResponse<Category>>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Category>>>(
            `/catalog/admin/categories`,
            { params: { page, size } }
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des catégories",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Catégories récupérées avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<Category>>(
            error,
            "Erreur lors de la récupération des catégories"
        );
    }
}

/**
 * 🔹 Récupère une catégorie par ID
 */
export async function adminGetCategoryById(
    id: string
): Promise<ResponseType<Category | null>> {
    if (!id)
        return {
            status: "error",
            message: "ID de catégorie manquant",
            data: null,
        };

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Category>>(
            `/catalog/admin/categories/${id}`
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération de la catégorie",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Catégorie récupérée avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Category>(
            error,
            "Erreur lors de la récupération de la catégorie"
        );
    }
}

/**
 * 🔧 Crée une nouvelle catégorie
 */
export async function adminCreateCategory(
    payload: CategorySchema
): Promise<ResponseType<Category | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<Category>>(
            `/catalog/admin/categories`,
            payload
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de création de la catégorie",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Catégorie créée avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Category>(
            error,
            "Erreur lors de la création de la catégorie"
        );
    }
}

/**
 * 🔧 Met à jour une catégorie existante
 */
export async function adminUpdateCategory(
    id: string,
    payload: Partial<Category>
): Promise<ResponseType<Category | null>> {
    if (!id)
        return {
            status: "error",
            message: "ID de catégorie manquant",
            data: null,
        };

    try {
        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<Category>>(
            `/catalog/admin/categories/${id}`,
            payload
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de mise à jour de la catégorie",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Catégorie mise à jour avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Category>(
            error,
            "Erreur lors de la mise à jour de la catégorie"
        );
    }
}

/**
 * 🗑️ Supprime une catégorie
 */
export async function adminDeleteCategory(
    id: string
): Promise<ResponseType<null>> {
    if (!id)
        return {
            status: "error",
            message: "ID de catégorie manquant",
            data: null,
        };

    try {
        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<void>>(
            `/catalog/admin/categories/${id}`
        );

        return {
            status: "success",
            message: res.data?.message || "Catégorie supprimée avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<null>(
            error,
            "Erreur lors de la suppression de la catégorie"
        );
    }
}