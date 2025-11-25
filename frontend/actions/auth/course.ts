"use server"

import {Category, Course, Enrollment} from "@/models";
import {ApiResponse, PagedResponse, PaginationResponse} from "@/lib/types";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {TypeResponse} from "@/lib/types";
import {requireUser} from "@/actions/auth/requireUser";
import Pagination from "@/components/general/Pagination";


/**
 * 🔹 Récupère un cours par son ID
 */
export async function getCourseBySlug(
    slug: string
): Promise<TypeResponse<Course | null>> {
    if (!slug)
        return {
            status: "error",
            message: "slug du cours manquant",
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


// @ts-ignore
/**
 * 🔹 Récupère les cours auxquels l’utilisateur est inscrit (paginé)
 *
 */
export async function getEnrolledCourses(
    page: number = 1,
    perPage: number
): Promise<TypeResponse<PagedResponse<Enrollment[]> | null>> {

    const user = await requireUser();

    if (!user)
        return {
            status: "success",
            message: "User non authentifié",
            data: null,
        };
    try {

        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Enrollment[]>>>(`/billing/enrollments/user/${user?.userId}/all/active`,
            {params: {page, size: perPage}}
        );

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des ventes",
                data: { content: [], currentPage: 0, totalPages: 0, perPage: 0, totalElements: 0},
            };
        }

        return {
            status: "success",
            message: res.data.message,
            data: res.data.data,
        };

    } catch (error) {
        return handleAxiosError<PagedResponse<Enrollment[]>>(error, "Erreur lors du chargement des ventes");
    }
}

/**
 * 🔹 Récupère tous les cours auxquels l’utilisateur est inscrit (non paginé)
 */
export async function getAllEnrolledCoursesByUser(): Promise<TypeResponse<Enrollment[] | null>> {

    const user = await requireUser();
    if (!user)
        return {
            status: "success",
            message: "Cours récupéré avec succès",
            data: [],
        };
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Enrollment[]>>(`/billing/enrollments/user/${user?.userId}/active`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des cours payés",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Cours récupéré avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Enrollment[]>(error, "Erreur lors de la récupération du cours payés");
    }
}

/*
Chack if user  bought a course
 */
export async function checkIfCourseBought(courseId: string): Promise<TypeResponse<Enrollment | null>> {

    const user = await requireUser();
    if (!user)
        return {
            status: "success",
            message: "Cours récupéré avec succès",
            data: null,
        };
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Enrollment>>(`/billing/enrollments/user/${user?.id}/course/${courseId}`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de récupération des cours payés",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Cours récupéré avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<Enrollment>(error, "Erreur lors de la récupération du cours payés");
    }
}