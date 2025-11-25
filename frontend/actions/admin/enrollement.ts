"use server"

import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {ApiResponse, TypeResponse} from "@/lib/types";

export async function adminGetEnrollmentsStats():Promise<TypeResponse<{date:string, enrollments:number}[]>> {
    const client = await AxiosServerClient();
    try {
        const res = await client.get<ApiResponse<{date:string, enrollments:number}[]>>(`/billing/admin/stats/enrollments?days=30`);

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des statistiques des inscriptions",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Statistiques des inscriptions récupérés avec succès",
            data: res.data.data,
        };
    } catch (error){
        return handleAxiosError<{date:string, enrollments:number}[]>(error, "Erreur de récupération des statistiques des inscriptions");
    }
}