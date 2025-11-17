import EmptyState from "@/components/general/EmptyState";
import CourseProgressCard from "@/app/dashboard/courses/[slug]/_components/CourseProgressCard";
import Pagination from "@/components/general/Pagination";
import {COURSES_PER_PAGE} from "@/constants/user-contants";
import {Suspense} from "react";
import {PublicCourseCardSkeleton} from "@/app/(root)/_components/PublicCourseCard";
import {Course} from "@/models";
import {getEnrolledCourses} from "@/actions/auth/course";


export default async function EnrolledCoursesUserPage(props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);

    return (
        <>
            <div className="flex flex-col gap-2 mt-4">
                <h1 className={"text-3xl font-bold"}>Enrolled Courses</h1>
                <p className={"text-muted-foreground"}>
                    Here you can see all the courses you have enrolled in.
                </p>
            </div>

            <Suspense fallback={<UserCourseCardSkeletonLayout/>}>
                <RenderCourses current={page} nbrPage={COURSES_PER_PAGE}/>
            </Suspense>
        </>
    )
}

async function RenderCourses({current, nbrPage}:{current?: number | undefined, nbrPage: number}) {
    const {data:enrolledCourses, totalPages, perPage, page:currentPage} = await getEnrolledCourses(current, nbrPage);

    return (
        <>
            {
                enrolledCourses.length === 0 ? (
                    <EmptyState
                        title={"No Courses Found"}
                        description={"You don't have any courses yet. Enroll in a course to get started."}
                        buttonText={"Enroll in a Course"}
                        href={"/courses"}
                    />
                ) : (
                    <>

                        <div className={"grid grid-cols-1 md:grid-cols-3 gap-6"}>
                            {enrolledCourses.map((item) => {

                                if(!item) return null;

                                return <CourseProgressCard key={item?.id} data={item.course as unknown as Course }/>
                            })}
                        </div>

                        {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages}/>}
                    </>
                )
            }
        </>
    )
}

function UserCourseCardSkeletonLayout() {
    return (
        <div className={"grid grid-cols-1 md:grid-cols-3 gap-6"}>
            {Array.from({length: 6}).map((_, index) => (
                <PublicCourseCardSkeleton key={index}/>
            ))}
        </div>
    )
}
