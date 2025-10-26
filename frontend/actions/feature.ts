import {Feature, PaginationResponse} from "@/models";

export async function getAllFeatures(current: number = 1, nbrPage: number ) :
    Promise<PaginationResponse<Feature>> {

    const data: Feature [] = [];
    const total =  0;


    return {
        data,
        total,
        page: current,
        perPage: nbrPage,
        totalPages: Math.ceil(total / nbrPage),
    };
}
