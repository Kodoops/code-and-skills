"use server";

import {ChapterSchema} from "@/lib/db/zodSchemas";
import {ApiResponse, Chapter, ResponseType} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";

/**
 * 🔹 Crée un chapitre pour un cours donné
 */
export async function adminCreateChapter(
    payload: ChapterSchema
): Promise<ResponseType<Chapter | null>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<Chapter>>(
            `/catalog/admin/chapters/course/${payload.courseId}`,
            payload
        );


        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de création du chapitre",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Chapitre créé avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Chapter>(error, "Erreur lors de la création du chapitre");
    }
}

/**
 * 🔧 Met à jour un chapitre existant
 */
export async function adminUpdateChapter(
    courseId: string,
    chapterId: string,
    payload: Partial<{
        title: string;
        description: string;
        order: number;
    }>
): Promise<ResponseType<Chapter | null>> {
    if (!courseId || !chapterId) {
        return {
            status: "error",
            message: "ID du cours ou du chapitre manquant",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<Chapter>>(
            `/catalog/admin/chapters/${chapterId}`,
            payload
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de mise à jour du chapitre",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Chapitre mis à jour avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Chapter>(error, "Erreur lors de la mise à jour du chapitre");
    }
}


/**
 * 🗑️ Supprime un chapitre d’un cours
 */
export async function adminDeleteChapter(
    chapterId: string,
    courseId:string
): Promise<ResponseType<null>> {
    if ( !courseId || !chapterId) {
        return {
            status: "error",
            message: "ID du cours ou chapitre manquant",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<void>>(
            `/catalog/admin/chapters/${chapterId}`
        );

        return {
            status: "success",
            message: res.data?.message || "Chapitre supprimé avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<null>(error, "Erreur lors de la suppression du chapitre");
    }
}


/**
 * 🔄 Réordonne les chapitres d’un cours
 */
export async function reorderChapters(
    courseId: string,
    chapters: { id: string; position: number }[]
): Promise<ResponseType<null>> {
    if (!chapters || chapters.length === 0) {
        return {
            status: "error",
            message: "Aucun chapitre fourni pour le réordonnancement",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.patch(`/catalog/admin/courses/${courseId}/chapters/reorder`, chapters);

        return {
            status: "success",
            message: res.data?.message || "Chapitres réordonnés avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<null>(error, "Erreur lors du réordonnancement des chapitres");
    }
}