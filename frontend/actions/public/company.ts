"use server"

import {ApiResponse, TypeResponse} from "@/lib/types";
import {Company} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";

export async function getCompanyInfos(): Promise<TypeResponse<Company | null>> {

    try {
        await new Promise(r => setTimeout(r, 2000));

        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Company | null>>("/content/companies/company");

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de réccupération des informations de la companie ",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Fetched company informations",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Company | null>(error, "Erreur de réccupération des informations de la companie");
    }
}
