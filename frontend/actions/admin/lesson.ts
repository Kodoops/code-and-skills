"use server";

import {LessonSchema} from "@/lib/db/zodSchemas";
import { AxiosServerClient } from "@/lib/axiosServerClient";
import { handleAxiosError } from "@/lib/handleAxiosError";
import { Lesson } from "@/models";
import {ApiResponse, TypeResponse} from "@/lib/types";

/**
 * 🔹 Récupère une leçon par son ID (admin)
 */
export async function adminGetLesson(
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

/**
 * 🔹 Crée une leçon dans un chapitre
 */
export async function adminCreateLesson(
    payload: LessonSchema
): Promise<TypeResponse<Lesson | null>> {
    if (!payload.chapterId) {
        return {
            status: "error",
            message: "ID du chapitre manquant",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<Lesson>>(
            `/catalog/admin/lessons/chapter/${payload.chapterId}`,
            {...payload, duration: 0, publicAccess: false}
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de création de la leçon",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Leçon créée avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Lesson>(error, "Erreur lors de la création de la leçon");
    }
}

/**
 * 🔧 Met à jour une leçon existante
 */
export async function adminUpdateLesson(
    lessonId: string,
    payload: LessonSchema
): Promise<TypeResponse<Lesson | null>> {
    if ( !lessonId) {
        return {
            status: "error",
            message: "ID du chapitre ou de la leçon manquant",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<Lesson>>(
            `/catalog/admin/lessons/${lessonId}`,
            payload
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de mise à jour de la leçon",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Leçon mise à jour avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Lesson>(error, "Erreur lors de la mise à jour de la leçon");
    }
}

/**
 * 🗑️ Supprime une leçon
 */
export async function adminDeleteLesson(
    lessonId: string
): Promise<TypeResponse<null>> {
    if ( !lessonId) {
        return {
            status: "error",
            message: "ID du chapitre ou de la leçon manquant",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<void>>(
            `/catalog/admin/lessons/${lessonId}`
        );

        return {
            status: "success",
            message: res.data?.message || "Leçon supprimée avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<null>(error, "Erreur lors de la suppression de la leçon");
    }
}

/**
 * 🔄 Réordonne les leçons d’un chapitre
 */
export async function reorderLessons(
    chapterId: string,
    lessons: { id: string; position: number }[]
): Promise<TypeResponse<null>> {
    if (!lessons || lessons.length === 0) {
        return {
            status: "error",
            message: "Aucune leçon fournie pour le réordonnancement",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.patch(`/catalog/admin/chapters/${chapterId}/lessons/reorder`, lessons);

        return {
            status: "success",
            message: res.data?.message || "Leçons réordonnées avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<null>(error, "Erreur lors du réordonnancement des leçons");
    }
}