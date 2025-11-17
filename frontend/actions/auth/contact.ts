"use server"

import {AxiosServerClient} from "@/lib/axiosServerClient";
import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import {ContactMessage} from "@/models";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {MESSAGES_PER_PAGE} from "@/constants/user-contants";
import {ReplyContactMessageSchema} from "@/lib/db/zodSchemas";

export async function getUserMessages({
        id,
        page = 0,
        size = MESSAGES_PER_PAGE,
        status
}: {
    id:string;
    page?: number;
    size?: number;
    status?: string;
}): Promise<TypeResponse<PagedResponse<ContactMessage> | null>> {
    try {
        const params: Record<string, any> = {
            page: page>0  ?page - 1:0,
            size,
            status
        };

        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<ContactMessage>>>(`/notifications/contact/user/${id}/messages`,
            {params}
        );


        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des messages de contact",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Messages de contact récupéré avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<ContactMessage>>(error, "Erreur de récupération des messages de contact");
    }
}


export async function deleteContactMessage({id, userId}: {
    id:string;
    userId:string;
}): Promise<TypeResponse<PagedResponse<ContactMessage> | null>> {

    try {

        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<null>>(`/notifications/contact/user/${userId}/messages/${id}`);


        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de la suppression du message de contact",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Messages de contact supprimé avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<ContactMessage>>(error, "Erreur de la suppression du message de contact");
    }

}

export async function archiveContactMessage({id, userId}: {
    id:string;
    userId:string;
}): Promise<TypeResponse<PagedResponse<ContactMessage> | null>> {

    try {

        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<ContactMessage>>(`/notifications/contact/user/${userId}/messages/${id}`);

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de l'archivage du message de contact",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Messages de contact archivé avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<ContactMessage>>(error, "Erreur lors de l'archivage du message de contact");
    }

}
