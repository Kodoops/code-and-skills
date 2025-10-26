import {PaginationResponse, Testimonial} from "@/models";

export async function getAllTestimonials(current: number = 1, nbrPage: number ):
    Promise<PaginationResponse<Testimonial>>{

    const data: Testimonial[] = [];
    const total = 0;

    return {
        data,
        total,
        page: current,
        perPage: nbrPage,
        totalPages: Math.ceil(total / nbrPage),
    };
}
