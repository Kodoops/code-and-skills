"use server"

import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import {CompanySocialLink, SocialLink} from "@/models";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {CompanySocialLinkSchema, SocialLinkSchema} from "@/lib/db/zodSchemas";
import { requireAdmin } from "./requireAdmin";

export async function adminGetSocialNetworks(
    page = 0,
    size = 10
): Promise<TypeResponse<PagedResponse<SocialLink>>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<SocialLink>>>(
            `/content/admin/social-links`,
            { params: { page, size } }
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des social links paginés",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Social links  récupérés avec succès",
            data: res.data.data,
        };

    } catch (error) {
        return handleAxiosError<PagedResponse<SocialLink>>(error, "Erreur lors de la récupération paginée des social links");
    }

}


export async function createSocialNetwork(values: SocialLinkSchema): Promise<TypeResponse<SocialLink | null>>{
    try{

    const client = await AxiosServerClient();
    const res = await client.post<ApiResponse<SocialLink>>(`/content/admin/social-links`, values);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la création du social link",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Social links  créé avec succès",
            data: res.data.data,
        };

    }catch (error) {
        return handleAxiosError<SocialLink>(error, "Erreur lors de la création du social link");
    }
}

export async function deleteSocialNetwork(id:string): Promise<TypeResponse<SocialLink | null>>{

    try{

        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<SocialLink>>(`/content/admin/social-links/${id}`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la suppression du social link",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Social links  supprimé avec succès",
            data: res.data.data,
        };

    }catch (error) {
        return handleAxiosError<SocialLink>(error, "Erreur lors de la suppression du social link");
    }
}

export async function addSocialLink(values:CompanySocialLinkSchema): Promise<TypeResponse<CompanySocialLink | null>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<CompanySocialLink>>(`/content/companies/links`,values);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de l'ajout du social link",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Social links  ajouté avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<CompanySocialLink>(error, "Erreur lors de l'ajout  du social link");
    }

}


export async function unlinkSocialNetwork(socialLinkId:string): Promise<TypeResponse<CompanySocialLink>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<CompanySocialLink>>(`/content/companies/links`,{
            data: { socialLinkId }
        });

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la suppression du social link",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Social links  retiré avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<CompanySocialLink>(error, "Erreur lors de la suppression du social link");
    }

}
