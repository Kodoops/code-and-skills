"use server"

import {requireAdmin} from "@/actions/admin/requireAdmin";
import {ReplyContactMessageSchema} from "@/lib/db/zodSchemas";
import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import {ContactMessage} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {MESSAGES_PER_PAGE} from "@/constants/user-contants";


export async function getMessages({
                                          page = 0,
                                          size = MESSAGES_PER_PAGE,
                                          status
                                      }: {
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
        const res = await client.get<ApiResponse<PagedResponse<ContactMessage>>>(`/notifications/contact/admin/messages`,
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


export async function replyToContactMessage(values: ReplyContactMessageSchema): Promise<TypeResponse<PagedResponse<ContactMessage> | null>> {

    const user = requireAdmin();
    try {

        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<ContactMessage>>(`/notifications/contact/admin/${values.contactMessageId}/reply`,
            values
        );


        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la réponse du message de contact",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Messages de contact archivé avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<ContactMessage>>(error, "Erreur lors de la réponse du message de contact");
    }

}