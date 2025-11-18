"use server"

import {Course, Enrollment} from "@/models";
import {ApiResponse, PaginationResponse} from "@/lib/types";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {TypeResponse} from "@/lib/types";
import {requireUser} from "@/actions/auth/requireUser";


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


/**
 * 🔹 Récupère les cours auxquels l’utilisateur est inscrit (paginé)
 *
 */
export async function getEnrolledCourses(
    page: number = 1,
    perPage: number
): Promise<PaginationResponse<Enrollment>> {
    const user = await requireUser();

    const client = await AxiosServerClient();
    const res = await client.get(`/billing/enrollments/user/${user?.userId}/all/active`);

    const data: Enrollment[] = res.data.data.content;
    // const courseIds = data.map(enrollment =>enrollment.courseId);
    // if(courseIds.length === 0)
    // {
    //     return {
    //         data:[],
    //         totalPages: 0,
    //         page,
    //         perPage,
    //         total: 0,
    //     };
    // }
    //
    // const response = await client.post(`/catalog/public/courses/list`,{
    //     courseIds: courseIds
    // });
    //
    // if(!response.data.success )
    //     if (!res.data?.success || !res.data.data) {
    //         return {
    //             data:[],
    //             totalPages: 0,
    //             page,
    //             perPage,
    //             total: 0,
    //         };
    //     }
    //
    // const courses = response.data.data;
    //
    // data.forEach(enrollment => {
    //     enrollment.course = courses.find((course: Course) => course.id === enrollment.courseId)!;
    // })
    const total = res.data.data.totalElements;

    return {
        data,
        totalPages: Math.ceil(total / perPage),
        page,
        perPage,
        total,
    };
}

/**
 * 🔹 Récupère tous les cours auxquels l’utilisateur est inscrit (non paginé)
 */
export async function getAllEnrolledCoursesByUser(): Promise<TypeResponse<Enrollment[] | null>> {

    const user = await requireUser();

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
export async function checkIfCourseBought(courseId: string): Promise<TypeResponse<Enrollment | null>>  {

    const user = await requireUser();

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