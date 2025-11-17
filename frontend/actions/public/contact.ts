"use server"

import {contactMessageSchema, ContactMessageSchema} from "@/lib/db/zodSchemas";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {ApiResponse,  TypeResponse} from "@/lib/types";
import {ContactMessage} from "@/models";
import {revalidatePath} from "next/cache";

export async function createContactMessage(values: ContactMessageSchema): Promise<TypeResponse<ContactMessage | null>> {

    try {
        const validation = contactMessageSchema.safeParse(values);
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data",
                data: null
            };
        }

        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<ContactMessage | null>>("/notifications/contact", values);

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de l'envoi du message ",
                data: null,
            };
        }

        revalidatePath(("/dashboard/messages?page=1"))

        return {
            status: "success",
            message: res.data.message,
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<ContactMessage | null>(error, "Erreur de l'envoi du message");
    }
}
