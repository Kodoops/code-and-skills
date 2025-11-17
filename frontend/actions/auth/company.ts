"use server"

import {ApiResponse, TypeResponse} from "@/lib/types";
import {Company} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";

export async function getCompanyInfos(): Promise<TypeResponse<Company | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Company>>(`/content/admin/companies/company`);

        console.log(res)

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération du informations sur la companie",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "companie récupéré avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Company>(error, "Erreur lors de la récupération du la  companie");
    }
}