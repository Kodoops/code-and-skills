"use server"

import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import {CompanySocialLink, SocialLink} from "@/models";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {SocialLinkSchema} from "@/lib/db/zodSchemas";

export async function getCompanySocialLinks(): Promise<TypeResponse<CompanySocialLink[]>> {

    try {
        const client = await AxiosServerClient();
         const res = await client.get<ApiResponse<CompanySocialLink[]>>(
             `/content/companies/links`
         );

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                code: res.data?.status ,
                message: res.data?.message || "Erreur de récupération des social links",
                data: null,
            };
        }

        return {
            status: "success",
            code: res.data?.status ,
            message: res.data.message || "Social links  récupérés avec succès",
            data: res.data.data,
        };

    } catch (error) {
        return handleAxiosError<CompanySocialLink[]>(error, "Erreur lors de la récupération  des social links");
    }

}


export async function getSocialLinksNotLinkedYet(): Promise<TypeResponse<SocialLink[]>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<SocialLink[]>>(
            `/content/companies/links/unlinked`
        );

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des social links",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Social links  récupérés avec succès",
            data: res.data.data,
        };

    } catch (error) {
        return handleAxiosError<SocialLink[]>(error, "Erreur lors de la récupération  des social links");
    }

}