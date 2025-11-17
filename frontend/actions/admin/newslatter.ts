"use server"

import {COURSES_PER_PAGE} from "@/constants/admin-contants";
import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import { Newsletter} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";

export async function getNewsletterList(
    {
        page = 0,
        size = COURSES_PER_PAGE,
        status  = null
    }:{
        page? :number,
        size? :number,
        status?: boolean | null | undefined
    }
): Promise<TypeResponse<PagedResponse<Newsletter>>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Newsletter>>>(
            `/notifications/newsletter/admin/all`,
            { params: { page, size, status } }
        );


        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des newsletters",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "newsletters récupérés avec succès",
            data: res.data.data,
        };
    } catch (error) {

        return handleAxiosError<PagedResponse<Newsletter>>(error, "Erreur lors de la récupération des newsletters");
    }
}


export async function deleteNewsletterSubscription(
   id:string
): Promise<TypeResponse<PagedResponse<Newsletter>>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<PagedResponse<Newsletter>>>(
            `/notifications/newsletter/admin/${id}`
        );


        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la suppression de la newsletter",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "newsletters supprimée avec succès",
            data: res.data.data,
        };
    } catch (error) {

        return handleAxiosError<PagedResponse<Newsletter>>(error, "Erreur lors de la suppression de la newsletter");
    }
}