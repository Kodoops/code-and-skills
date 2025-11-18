import { FEATURES_PER_PAGE } from "@/constants/admin-contants";
import { AxiosServerClient } from "@/lib/axiosServerClient";
import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import { Feature } from "@/models";
import {handleAxiosError} from "@/lib/handleAxiosError";

/**
 * 🌍 Récupère la liste paginée et filtrée des features publics
 */
export async function getFeatures(
                                     page = 0,
                                     size = FEATURES_PER_PAGE,
): Promise<TypeResponse<PagedResponse<Feature> | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Feature>>>(
            "/content/features",
            { params: { page, size } }
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des features ",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message,
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<Feature>>(error, "Erreur lors du chargement des features");
    }
}