import {ApiResponse, BillingResponseStats, CatalogResponseStats, ProfileResponseStats, TypeResponse} from "@/lib/types";
import {notFound} from "next/navigation";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {Enrollment} from "@/models";
import {handleAxiosError} from "@/lib/handleAxiosError";
import {requireAdmin} from "@/actions/admin/requireAdmin";


export async function adminGetDashboardUsersStats():Promise<TypeResponse<ProfileResponseStats>> {

    try{
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<ProfileResponseStats>>(`/profiles/admin/dashboard`);

        if(!res || !res.data){

            return {
                status: 'error',
                code: res.data.status,
                message: res.data.message,
                data: null
            }
        }

        return {
            status: 'success',
            code: res.data.status,
            message: res.data.message,
            data: res.data.data
        }

    }catch (error){
        return   handleAxiosError<ProfileResponseStats>(error)
    }
}


export async function adminGetDashboardCustomersStats():Promise<TypeResponse<BillingResponseStats>> {

    try{
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<BillingResponseStats>>(`/billing/admin/dashboard`);

        if(!res || !res.data){

            return {
                status: 'error',
                code: res.data.status,
                message: res.data.message,
                data: null
            }
        }

        return {
            status: 'success',
            code: res.data.status,
            message: res.data.message,
            data: res.data.data
        }

    }catch (error){
        return   handleAxiosError<BillingResponseStats>(error)
    }
}


export async function adminGetDashboardCourseStats():Promise<TypeResponse<CatalogResponseStats>> {

    try{
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<CatalogResponseStats>>(`/catalog/admin/dashboard`);

        if(!res || !res.data){

            return {
                status: 'error',
                code: res.data.status,
                message: res.data.message,
                data: null
            }
        }

        return {
            status: 'success',
            code: res.data.status,
            message: res.data.message,
            data: res.data.data
        }

    }catch (error){
        return   handleAxiosError<CatalogResponseStats>(error)
    }
}

export async function getEnrollmentsStats():Promise<TypeResponse<{
    totalEnrollments: number,
    totalPathsEnrollments: number,
    totalCoursesEnrollments: number,
    totalWorkshopsEnrollments: number,
    totalSubscriptions: number
}>> {

    const user = await  requireAdmin();
    if(!user) return notFound();

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<Enrollment[]>>(`/billing/admin/enrollments/count`);

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