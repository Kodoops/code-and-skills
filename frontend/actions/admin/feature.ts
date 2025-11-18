"use server";

import { FeatureSchema} from "@/lib/db/zodSchemas";
import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import { Feature} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";

export async function getAllFeatures( page = 0,
                                      size = 10 ) :
    Promise<TypeResponse<PagedResponse<Feature>>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Feature>>>(`/content/admin/features`,
            { params: { page, size } });

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de lecture des features",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Features obtenue avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<Feature>>(error, "Erreur lors de la lecture des features");
    }

}

export async function adminCreateFeature(
    payload: FeatureSchema
): Promise<TypeResponse<Feature | null>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<Feature>>(`/content/admin/features`, payload);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de création de feature",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Feature créée avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Feature>(error, "Erreur lors de la création de feature");
    }
}


export async function adminGetFeature(
    id: string
): Promise<TypeResponse<Feature | null>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Feature>>(`/content/admin/features/${id}`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de lecture de feature",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Feature obtenue avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Feature>(error, "Erreur lors de la lecture de feature");
    }
}

export async function adminUpdateFeature(
    values: FeatureSchema,
    id: string
): Promise<TypeResponse<Feature | null>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<Feature>>(`/content/admin/features/${id}`, values);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de lecture de feature",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Feature obtenue avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Feature>(error, "Erreur lors de la lecture de feature");
    }
}

export async function adminDeleteFeature(
    id: string
): Promise<TypeResponse<Feature | null>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<Feature>>(`/content/admin/features/${id}`);

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de la suppression de feature",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Feature supprimée avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Feature>(error, "Erreur lors de la suppression de feature");
    }
}