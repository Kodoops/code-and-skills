"use server";

import {Category, Course} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {ApiResponse, PagedResponse, PaginationResponse, TypeResponse} from "@/lib/types";

/**
 * 🔹 Récupère les catégories les plus populaires
 */
export async function getPopularCategories(
    nbrOfCategory = 6
): Promise<TypeResponse<Category[] | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Category[]>>(
            `/catalog/public/categories/popular`,
            {params: {limit: nbrOfCategory}}
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la récupération des catégories populaires",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Catégories populaires récupérées avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Category[]>(error, "Erreur lors de la récupération des catégories populaires");
    }
}

/**
 * 🔹 Récupère toutes les catégories
 */
export async function getAllCategories(): Promise<TypeResponse<Category[] | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Category[]>>(`/catalog/public/categories/all`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la récupération des catégories",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Catégories récupérées avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Category[]>(error, "Erreur lors de la récupération des catégories");
    }
}

/**
 * 🔹 Récupère les catégories paginées (placeholder - non encore implémenté côté backend)
 */
export async function getPaginatedCategories(
    current: number = 1,
    nbrPage: number
): Promise<TypeResponse<PagedResponse<Category> | null>> {

    const params: Record<string, any> = {
        page: current - 1,
        size:nbrPage,
    };
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Category>>>(`/catalog/public/categories`,
            {params});

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des catégories",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message,
            data: res.data.data,
        };

    } catch (error) {
        return handleAxiosError<PagedResponse<Category>>(error, "Erreur lors du chargement des catégories");
    }
}

/**
 * 🔹 Récupère une liste aléatoire de catégories (placeholder)
 */
export async function getRandomCategories(limit: number = 6): Promise<string[]> {
    // ⚠️ TODO: à implémenter lorsque le backend exposera une route dédiée
    return [];
}