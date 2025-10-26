"use server";

import {Course, Enrollment, UserProfile} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {requireUser} from "@/actions/auth/requireUser";
import {COURSES_PER_PAGE} from "@/constants/user-contants";
import {ApiResponse, PagedResponse, PaginationResponse, TypeResponse} from "@/lib/types";


/**
 * 🌍 Récupère la liste paginée et filtrée des cours publics
 */
export async function getCourses({
                                     categorySlug,
                                     level,
                                     isFree,
                                     page = 0,
                                     size = COURSES_PER_PAGE,
                                 }: {
    categorySlug?: string;
    level?: string;
    isFree?: string;
    page?: number;
    size?: number;
}): Promise<TypeResponse<PagedResponse<Course> | null>> {
    try {
        const client = await AxiosServerClient();

        const params: Record<string, any> = {
            page: page - 1,
            size,
        };

        if (categorySlug) params.categorySlug = categorySlug;
        if (level) params.level = level;
        if (isFree !== undefined) params.isFree = isFree;

        const res = await client.get<ApiResponse<PagedResponse<Course>>>(
            "/catalog/public/courses",
            {params}
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des cours publics",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message,
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<Course>>(error, "Erreur lors du chargement des cours publics");
    }
}

/**
 * 🔹 Récupère les cours récents (public)
 */
export async function getRecentCourses(
    nbrOfCourses: number = 7
): Promise<TypeResponse<Course[] | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Course[]>>(
            `/catalog/public/courses/recent`,
            {params: {limit: nbrOfCourses}}
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la récupération des cours récents",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Cours récents récupérés avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Course[]>(error, "Erreur lors de la récupération des cours récents");
    }
}

/**
 * 🔹 Récupère un cours par son Slug
 */
export async function adminGetCourseBySlug(
    slug: string
): Promise<TypeResponse<Course | null>> {
    if (!slug)
        return {
            status: "error",
            message: "Slug du cours manquant",
            data: null,
        };

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Course>>(`/catalog/public/courses/${slug}`);

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
