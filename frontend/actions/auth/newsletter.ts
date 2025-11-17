"use server"

import {ApiResponse, TypeResponse} from "@/lib/types";
import {Newsletter} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";

export async function getNewsletterSubscription(email: string): Promise<TypeResponse<Newsletter> | null> {

    try {

        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Newsletter>>(`/notifications/newsletter/user/${email}`);

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la réccupération de la newsletter",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Newsletter fetched successfully",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Newsletter>(error, "Erreur lors de la réccupération de la newsletter");
    }

}

export async function unsubscribeNewsletter(email: string): Promise<TypeResponse<Newsletter> > {

    try {

        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<Newsletter>>(`/notifications/newsletter/user/${email}`);

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la désinscription de la newsletter",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Newsletter removed successfully",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Newsletter > (error, "Erreur lors de la désinscription de la newsletter");
    }

}
