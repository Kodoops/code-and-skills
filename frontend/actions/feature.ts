import { Feature} from "@/models";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {ApiResponse, PagedResponse, TypeResponse} from "@/lib/types";
import {handleAxiosError} from "@/lib/handleAxiosError";

export async function getAllFeatures( page = 0,
                                      size = 10 ) :
    Promise<TypeResponse<PagedResponse<Feature>>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<PagedResponse<Feature>>>(`/content/admin/features`,
            { params: { page, size } });

        if (!res.data?.success || !res.data.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de lecture de feature",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Feature obtenue avec succès",
            data: res.data.data,
        };
    } catch (error) {
        return handleAxiosError<PagedResponse<Feature>>(error, "Erreur lors de la lecture de feature");
    }

}
