import "server-only";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {ApiResponse, SimpleStatistics, TypeResponse} from "@/lib/types";
import {handleAxiosError} from "@/lib/handleAxiosError";


export async function getStats():Promise<TypeResponse<SimpleStatistics | null>> {

    try{

        const client = await AxiosServerClient();
        const courseResp = await client.get<ApiResponse<SimpleStatistics>>(
            "/catalog/public/courses/count");

        if (!courseResp.data?.success || !courseResp.data) {

            return {
                status: "error",
                code: courseResp.status,
                message: courseResp.data?.message || "Erreur de récupération des statistiques ",
                data: null
            };
        }

        return {
            status: "success",
            code: courseResp.status,
            message: courseResp.data.message,
            data:courseResp.data.data
        };

    } catch (error) {
        return handleAxiosError<SimpleStatistics>(error, "Erreur lors du chargement des statistiques");
    }

}
