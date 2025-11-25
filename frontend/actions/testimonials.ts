import { Testimonial} from "@/models";
import {PagedResponse} from "@/lib/types";

export async function getAllTestimonials(current: number = 1, nbrPage: number ):
    Promise<PagedResponse<Testimonial>>{

    const content: Testimonial[] = [];
    const totalPages = 0;

    return {
        content,
        currentPage: current,
        totalPages: Math.ceil(totalPages / nbrPage),
        perPage: nbrPage,
        totalElements: content.length,
    };
}
