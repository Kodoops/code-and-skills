import {Course} from "@/models";

export function hasAccess(publicLesson: boolean, course: Course , enrolled: boolean) {

    if(course.price === 0 || enrolled) return true;
    // Enrollement
    if (publicLesson) return true;

    return false;
}
