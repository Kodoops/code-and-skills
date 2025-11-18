import {Feature, Page} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {ApiResponse, TypeResponse} from "@/lib/types";
import {handleAxiosError} from "@/lib/handleAxiosError";

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

export async function getPage(slug: string): Promise<TypeResponse<Page>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Page>>(
            "/content/pages/" + slug );

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
