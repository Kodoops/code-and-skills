"use server";

import {
    Course,
} from "@/models";
import { AxiosServerClient } from "@/lib/axiosServerClient";
import { COURSES_PER_PAGE } from "@/constants/admin-contants";
import { CourseSchema} from "@/lib/db/zodSchemas";
import { requireAdmin } from "@/actions/admin/requireAdmin";
import { handleAxiosError } from "@/lib/handleAxiosError";
import {revalidatePath} from "next/cache";
import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";

/**
 * 🔹 Liste paginée des cours (admin)
 */
export async function adminGetCourses(
    page = 0,
    size = COURSES_PER_PAGE
): Promise<TypeResponse<PagedResponse<Course>>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Course>>>(
            `/catalog/admin/courses`,
            { params: { page, size } }
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des cours",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Cours récupérés avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<Course>>(error, "Erreur lors de la récupération des cours");
    }
}

/**
 * 🔹 Récupère un cours par son ID
 */
export async function adminGetCourseById(
    id: string
): Promise<TypeResponse<Course | null>> {
    if (!id)
        return {
            status: "error",
            message: "ID du cours manquant",
            data: null,
        };

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Course>>(`/catalog/admin/courses/${id}`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération du cours",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Cours récupéré avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Course>(error, "Erreur lors de la récupération du cours");
    }
}

/**
 * 🔧 Crée un nouveau cours
 */
export async function adminCreateCourse(
    payload: CourseSchema
): Promise<TypeResponse<Course | null>> {
    await requireAdmin();

    try {
        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<Course>>(
            `/catalog/admin/courses`,
            payload
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de création du cours",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Cours créé avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Course>(error, "Erreur lors de la création du cours");
    }
}

/**
 * 🔧 Met à jour un cours existant
 */
export async function adminUpdateCourse(
    id: string,
    payload: CourseSchema
): Promise<TypeResponse<Course | null>> {
    try {

        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<Course>>(
            `/catalog/admin/courses/${id}`,
            payload
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de mise à jour du cours",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Cours mis à jour avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Course>(error, "Erreur lors de la mise à jour du cours");
    }
}

/**
 * 🚀 Publie un cours
 */
export async function adminPublishCourse(
    id: string,
): Promise<TypeResponse<Course | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.patch<ApiResponse<Course>>(
            `/catalog/admin/courses/${id}/publish`
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la publication du cours",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Cours publié avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Course>(error, "Erreur lors de la publication du cours");
    }
}

/**
 * 🗑️ Supprime un cours
 */
export async function adminDeleteCourse(id: string): Promise<TypeResponse<null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<void>>(`/catalog/admin/courses/${id}`);

        return {
            status: "success",
            message: res.data?.message || "Cours supprimé avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<null>(error, "Erreur lors de la suppression du cours");
    }
}

/**
 * 🎯 Met à jour uniquement les objectifs
 */
export async function adminUpdateObjectives(
    id: string,
    objectives: string[]
): Promise<TypeResponse<Course | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.patch<ApiResponse<Course>>(
            `/catalog/admin/courses/${id}/objectives`,
            objectives
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la mise à jour des objectifs",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Objectifs mis à jour avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Course>(error, "Erreur lors de la mise à jour des objectifs");
    }
}

/**
 * 🧩 Met à jour uniquement les prérequis
 */
export async function adminUpdatePrerequisites(
    id: string,
    prerequisites: string[]
): Promise<TypeResponse<Course | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.patch<ApiResponse<Course>>(
            `/catalog/admin/courses/${id}/prerequisites`,
            prerequisites
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la mise à jour des prérequis",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Prérequis mis à jour avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Course>(error, "Erreur lors de la mise à jour des prérequis");
    }
}

/**
 * 🧩 Tags, objectifs et prérequis additionnels
 */
export async function updateCourseTags(courseId: string, selection: string[]) {
    try {
        const client = await AxiosServerClient();
        const res = await client.patch<ApiResponse<Course>>(
            `/catalog/admin/courses/${courseId}/tags`,
            selection
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la mise à jour des tags",
                data: null,
            };
        }

        revalidatePath("/admin/courses/" + courseId+"/edit");
        return {
            status: "success",
            message: res.data.message || "Tags mis à jour avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Course>(error, "Erreur lors de la mise à jour des tags");
    }
}

/*
*  COURSE CONTENT
 */

