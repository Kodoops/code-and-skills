"use server";

import {  Domain} from "@/models";
import { AxiosServerClient } from "@/lib/axiosServerClient";
import { DomainSchema } from "@/lib/db/zodSchemas";
import { handleAxiosError } from "@/lib/handleAxiosError";
import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import {requireAdmin} from "@/actions/admin/requireAdmin";

/**
 * 🔹 Récupère tous les domaines (non paginés)
 */
export async function adminGetAllDomains(): Promise<TypeResponse<Domain[] | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Domain[]>>(`/catalog/admin/domains/all`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des domaines",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Domaines récupérés avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Domain[]>(error, "Erreur lors de la récupération des domaines");
    }
}

/**
 * 🔹 Récupère la liste paginée des domaines
 */
export async function adminGetDomains(
    page = 0,
    size = 10
): Promise<TypeResponse<PagedResponse<Domain>>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Domain>>>(
            `/catalog/admin/domains`,
            { params: { page, size } }
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des domaines paginés",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Domaines récupérés avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<Domain>>(error, "Erreur lors de la récupération paginée des domaines");
    }
}

/**
 * 🔹 Récupère un domaine par son ID
 */
export async function adminGetDomainById(domainId: string): Promise<TypeResponse<Domain | null>> {
    if (!domainId) {
        return {
            status: "error",
            message: "ID du domaine manquant",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Domain>>(`/catalog/admin/domains/${domainId}`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération du domaine",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Domaine récupéré avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Domain>(error, "Erreur lors de la récupération du domaine");
    }
}

/**
 * 🔧 Met à jour un domaine (admin)
 */
export async function adminUpdateDomain(
    id: string,
    payload: Partial<Domain>
): Promise<TypeResponse<Domain | null>> {
    if (!id) {
        return {
            status: "error",
            message: "ID du domaine manquant",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<Domain>>(`/catalog/admin/domains/${id}`, payload);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de mise à jour du domaine",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Domaine mis à jour avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Domain>(error, "Erreur lors de la mise à jour du domaine");
    }
}

/**
 * 🔧 Crée un nouveau domaine (admin)
 */
export async function adminCreateDomain(
    payload: DomainSchema
): Promise<TypeResponse<Domain | null>> {

    try {
        const client = await AxiosServerClient();

        const res = await client.post<ApiResponse<Domain>>(`/catalog/admin/domains`, payload);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de création du domaine",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Domaine créé avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Domain>(error, "Erreur lors de la création du domaine");
    }
}

/**
 * 🗑️ Supprime un domaine (admin)
 */
export async function adminDeleteDomain(id: string): Promise<TypeResponse<null>> {
    if (!id) {
        return {
            status: "error",
            message: "ID du domaine manquant",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<void>>(`/catalog/admin/domains/${id}`);

        return {
            status: "success",
            message: res.data?.message || "Domaine supprimé avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<null>(error, "Erreur lors de la suppression du domaine");
    }
}