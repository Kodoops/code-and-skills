import React, {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import AdminCourseCard, {AdminCourseCardSkeleton} from "@/app/admin/courses/_components/AdminCourseCard";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import Pagination from "@/components/general/Pagination";
import {COURSES_PER_PAGE} from "@/constants/admin-contants";
import {adminGetCourses} from "@/actions/admin/course";
import CardError from "@/components/custom-ui/CardError";


const CoursesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", COURSES_PER_PAGE);


    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Cources</h1>
                <Link href={"/admin/courses/create"}
                      className={buttonVariants()}>
                    Create Course
                </Link>
            </div>
            <Suspense fallback={<AdminCourseCardSkeletonLayout/>}>
                <RenderCourses current={page - 1 } nbrPage={COURSES_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default CoursesPage;

async function RenderCourses({current, nbrPage}:{current?: number | undefined, nbrPage: number}) {

     const response = await adminGetCourses(current , nbrPage);

    if (response.status ==="error") {
        return <CardError message={"Impossible de charger les cours."} title={"Erreur Chargement des cours"} />
    }

    const data = response?.data?.content;
    const totalPages = response?.data.totalPages;
    const currentPage = response?.data.currentPage

    return (
        <>
            {data?.length === 0 ?
                <EmptyState title={"No Courses Found"}
                            description={"You don't have any courses yet. Create a new course to get started."}
                            buttonText={"Create Course"}
                            href={"/admin/courses/create"}
                />
                :
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7 ">
                        {data?.map((course) => (
                            <AdminCourseCard key={course.id} data={course}/>
                        ))}
                    </div>
                    {totalPages > 1 && <Pagination page={currentPage + 1} totalPages={totalPages}/>}
                </>
            }
        </>
    )
}

function AdminCourseCardSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7 ">
            {Array.from({length: 4}).map((_, index) => (
                <AdminCourseCardSkeleton key={index}/>
            ))}
        </div>
    )

}
