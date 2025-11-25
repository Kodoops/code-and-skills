"use server";

import { AxiosServerClient } from "@/lib/axiosServerClient";
import {Enrollment, UserProfile} from "@/models";
import { handleAxiosError } from "@/lib/handleAxiosError";
import {ApiResponse, TypeResponse} from "@/lib/types";
import type {UpdateProfileSchema} from "@/lib/db/zodSchemas";
import { requireUser } from "./requireUser";
import {notFound} from "next/navigation";

/**
 * 🔹 Récupère le profil utilisateur connecté
 */
export async function getUserProfileAction(): Promise<TypeResponse<UserProfile | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<UserProfile>>("/profiles/me");

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Impossible de récupérer le profil utilisateur.",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Profil utilisateur récupéré avec succès.",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<UserProfile>(error, "Erreur lors de la récupération du profil utilisateur.");
    }
}

/**
 * 🔧 Met à jour le profil utilisateur
 */
export async function updateProfileAction(values: UpdateProfileSchema): Promise<TypeResponse<UserProfile | null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.put<ApiResponse<UserProfile>>("/profiles/me", values);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la mise à jour du profil.",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Profil mis à jour avec succès.",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<UserProfile>(error, "Erreur lors de la mise à jour du profil utilisateur.");
    }
}

export async function userGetDashboardStats():Promise<TypeResponse<{
    totalEnrollments: number,
    totalPathsEnrollments: number,
    totalCoursesEnrollments: number,
    totalWorkshopsEnrollments: number,
    totalSubscriptions: number
}>> {

    const user = await  requireUser();
    if(!user) return notFound();

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Enrollment[]>>(`/billing/enrollments/user/${user.userId}/count`);

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur lors de la mise à jour du profil.",
                data: null,
            };
        }
        const courses = res.data.data.filter(enrollment => enrollment.type === "COURSE");
        const paths = res.data.data.filter(enrollment => enrollment.type === "PATH")
        const workshops = res.data.data.filter(enrollment => enrollment.type === "WORKSHOP")
        const subscriptions = res.data.data.filter(enrollment => enrollment.type === "SUBSCRIPTION")

        const total = res.data.data ? res.data.data.length : 0;

        return {
            status: "success",
            message: res.data.message || "Profil mis à jour avec succès.",
            data: {
                totalEnrollments : total || 0,
                totalPathsEnrollments:paths.length || 0,
                totalCoursesEnrollments:courses.length || 0,
                totalWorkshopsEnrollments:workshops.length || 0,
                totalSubscriptions: subscriptions.length || 0
            },
        };
    } catch (error) {
        return handleAxiosError<{
            totalEnrollments: number,
            totalPathsEnrollments: number,
            totalCoursesEnrollments: number,
            totalWorkshopsEnrollments: number,
            totalSubscriptions: number
        } >(error, "Erreur lors de la mise à jour du profil utilisateur.");
    }

}