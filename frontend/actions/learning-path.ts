import {LearningPath} from "@/models";
import { requireUser } from "./auth/requireUser";
import {PaginationResponse} from "@/lib/types";

export async function getFeaturedLearningPaths(nbrOfPaths: number = 4): Promise<LearningPath[]> {

    return [];
}


export async function getEnrolledLearningPaths(page: number = 1, perPage: number ): Promise<PaginationResponse<LearningPath>> {
    const user = await requireUser();

    const data : LearningPath[] = [];
    const total = 0;

    return {
        data,
        totalPages: Math.ceil(total / perPage),
        page: page,
        perPage,
        total
    };

}


export async function getAllEnrolledLearningPathsByUser() : Promise<LearningPath[]> {

    const user = await requireUser();

    const data : LearningPath[] = [];

    return data;

}
