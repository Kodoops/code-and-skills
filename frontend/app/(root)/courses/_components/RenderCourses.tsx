import React from "react";
import PublicCourseCard from "@/app/(root)/_components/PublicCourseCard";
import EmptyState from "@/components/general/EmptyState";
import {SearchIcon} from "lucide-react";
import Pagination from "@/components/general/Pagination";
import {Course, Enrollment} from "@/models";
import {getCourses} from "@/actions/public/course";
import CardError from "@/components/custom-ui/CardError";
import {getAllEnrolledCoursesByUser} from "@/actions/auth/course";
import CourseProgressCard from "@/app/dashboard/courses/[slug]/_components/CourseProgressCard";

interface CourseFilters {
    categorySlug?: string;
    level?: string;
    isFree?: string;
    page: number;
    perPage: number;
}

const RenderCourses = async ({filters}: { filters: CourseFilters }) => {
    const response = await getCourses(filters);

    if(!response) {
        return  <EmptyState
            title={"Erreur du service des catégories"}
            description={ "Service is temporarily unavailable "}
        />;
    }

    if(response.status !== "success") {
        return  <EmptyState
            title={"Erreur du service des cours"}
            description={ response.code && response.code===503 ? "Service is temporarily unavailable ":response.message}
        />;
    }

    const data = response?.data?.content;
    const totalPages = response?.data?.totalPages;
    const currentPage = response?.data?.currentPage;


    const res  =  await getAllEnrolledCoursesByUser();

    let enrolledByUser: Enrollment[] = [];

    if(res?.status === "success") {
        enrolledByUser = res?.data ?? [];
    }

    // On extrait la liste des IDs des cours déjà suivis
    const enrolledCourseIds =  enrolledByUser.length > 0 ? enrolledByUser.map(enrollment => enrollment?.course?.id) :null;

    const alreadyEnrolled: string[] = [];

    enrolledCourseIds!=null &&  data?.map((course:Course) => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        if (isEnrolled) {
            alreadyEnrolled.push(course.id);
        }
    });


    if (data?.length === 0) {
        return (
            <EmptyState
                title="No Courses Found"
                description="No courses found with the selected filters."
                buttonText="All Courses"
                href="/courses?level=&categorySlug=&isFree"
                icon={SearchIcon}
            />
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.map((course:Course) => (
                    alreadyEnrolled.includes(course.id) ? <CourseProgressCard key={course?.id} data={course }/> :
                        <PublicCourseCard data={course} isEnrolled={alreadyEnrolled.includes(course.id)} key={course.id} />
                ))}

            </div>

            {totalPages && totalPages > 1 && <Pagination page={currentPage!+1} totalPages={totalPages!}/>}
        </>
    );
};

export default RenderCourses;
