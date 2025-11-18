"use server"

import {Feature, Page} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {PageLinkSchema} from "@/lib/db/zodSchemas";

export async function getAllPages( page = 0,
                                      size = 10, type?:string ) :
    Promise<TypeResponse<PagedResponse<Page>>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Page>>>(`/content/admin/pages`,
            { params: { page, size, type } });

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de lecture des pages",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "pabes obtenues avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<Page>>(error, "Erreur lors de la lecture des pages");
    }

}

export async function createPage( values:PageLinkSchema )  :
    Promise<TypeResponse<Page>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<Page>>(`/content/admin/pages`,
            values);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de creation de la page",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "page créée avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Page>(error, "Erreur de creation de la page");
    }

}

export async function updatePage( id:string, values:PageLinkSchema )  :
    Promise<TypeResponse<Page>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<Page>>(`/content/admin/pages/${id}`,
            values);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de mise ajour de la page",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "page  mise à jour avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Page>(error, "Erreur de mise à jour de la page");
    }

}

export async function deletePage( id:string)  :
    Promise<TypeResponse<void>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<void>>(`/content/admin/pages/${id}`);

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de suppression de la page",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "page supprimée avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<void>(error, "Erreur de suppression de la page");
    }

}

export async function getPageLinks(type: string): Promise<TypeResponse<Page[]>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Page[]>>(
            "/content/pages/type?type=" + type );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des pages  ",
                data: [],
            };
        }

        return {
            status: "success",
            message: res.data.message || "liste des pages ",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Page[]>(error, "Erreur lors du chargement des pages");
    }
}

export async function getPage(id: string): Promise<TypeResponse<Page>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Page>>(
            "/content/admin/pages/" + id );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération de la page  ",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "page demandée . ",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Page>(error, "Erreur lors du chargement de la page");
    }
}

export async function getPageBySlug(slug: string): Promise<TypeResponse<Page>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Page>>(
            "/content/admin/pages/slug/" + slug );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération de la page  ",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "page demandée . ",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Page>(error, "Erreur lors du chargement de la page");
    }
}