import "server-only";
import {AxiosServerClient} from "@/lib/axiosServerClient";
import {ApiResponse} from "@/lib/types";


export async function getStats() {

    let courses = 0;
    let lessons = 0;
    const quizzes = 0;

    const client = await AxiosServerClient();
    const courseResp = await client.get<ApiResponse<Map<string, number>>>(
        "/catalog/public/courses/count");
    if (courseResp.data?.success && courseResp.data.data) {

        // @ts-ignore
        courses = courseResp.data?.data.courses as number;
        // @ts-ignore
        lessons = courseResp.data?.data.lessons as number;
    }

    return {
        courses, lessons, quizzes
    };

}
