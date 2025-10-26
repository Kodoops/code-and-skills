import {ApiResponse, TypeResponse} from "@/lib/types";
import { Lesson } from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";

/**
 * 🔹 Récupère une leçon par son ID (admin)
 */
export async function getLesson(
    lessonId: string
): Promise<TypeResponse<Lesson | null>> {
    if (!lessonId) {
        return {
            status: "error",
            message: "ID de la leçon manquant",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Lesson>>(
            `/catalog/admin/lessons/${lessonId}`
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la récupération de la leçon",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Leçon récupérée avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Lesson>(error, "Erreur lors de la récupération de la leçon");
    }
}