"use server";

import {TypeResponse} from "@/lib/types";
import {LessonProgress} from "@/models";
import {revalidatePath} from "next/cache";
import {AxiosServerClient} from "@/lib/axiosServerClient";

export async function getCourseProgress(courseId: string): Promise<TypeResponse< LessonProgress[]>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.get(`/learning-analytics/progress/${courseId}`, {
            headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate", // 🔥 empêche tout cache HTTP
                Pragma: "no-cache",
                Expires: "0",
            },
        });

        if(!res || !res.data || !res.data.status){
            return {
                status: "error",
                message: "Something went wrong, Failed to get course progress.",
                data  :[]
            };
        }

        return {
            status: "success",
            message: res.data.message ||"course progress",
            data  :res.data.data
        }

    } catch (error: any) {
        return { status: "error", message: error.response?.data?.message || "Error" , data:null};
    }
}

export async function markLessonComplete(lessonId: string, slug: string, courseId:string): Promise<TypeResponse< LessonProgress[]>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.post(
            `/learning-analytics/progress/${courseId}/${lessonId}/complete`
        );

        console.log(res.data)
        if(!res || !res.data || !res.data.status ){
            return {
                status: "error",
                message: "Something went wrong, Failed to mark lesson completed.",
                data  :null
            };
        }

        revalidatePath(`/dashboard/courses/${slug}`);
        return {
            status: "success",
            message: res.data.message ||"Lesson marked as uncompleted.",
            data  :res.data.data
        }

    } catch (error: any) {

        return {
            status: "error",
            message: error.response?.data?.message || "Something went wrong, Failed to mark lesson completed.",
            data  : null
        };
    }

}

export async function markLessonUnCompleted(lessonId: string, slug: string):Promise<TypeResponse< LessonProgress[]>> {

    try {
        const client = await AxiosServerClient();
        const res = await client.post(
            `/learning-analytics/progress/${lessonId}/uncomplete`
        );
        if(!res || !res.data  || !res.data.status ){
            return {
                status: "error",
                message: "Something went wrong, Failed to mark lesson uncompleted.",
                data  :null
            };
        }

        revalidatePath(`/dashboard/courses/${slug}`);
        return {
            status: "success",
            message: res.data.message ||"Lesson marked as uncompleted.",
            data  :res.data.data
        }

    } catch (error: any) {
        return {
            status: "error",
            message: error.response?.data?.message || "Something went wrong, Failed to mark lesson uncompleted.",
            data  :null
        };
    }
}