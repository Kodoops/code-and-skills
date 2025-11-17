"use server"

import {ApiResponse, TypeResponse} from "@/lib/types";
import {Company} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {CompanySchema} from "@/lib/db/zodSchemas";

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

export async function createCompanyInfos(values: CompanySchema): Promise<TypeResponse<Company | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<Company>>(`/content/admin/companies`, values);

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de la création des informations de la companie",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "companie créée avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Company>(error, "Erreur lors de  la création des informations de la  companie");
    }
}


export async function updateCompanyInfos(values: CompanySchema): Promise<TypeResponse<Company | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<Company>>(`/content/admin/companies`, values);

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de la mise à jour  des informations de la companie",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "companie mise a jour avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Company>(error, "Erreur lors de  de la mise à jour  des informations de la  companie");
    }
}