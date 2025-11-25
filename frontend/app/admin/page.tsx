import {ChartAreaInteractive} from "@/components/sidebar/chart-area-interactive"


import React, {Suspense} from "react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import AdminCourseCard, {AdminCourseCardSkeleton} from "@/app/admin/courses/_components/AdminCourseCard";
import {adminGetEnrollmentsStats} from "@/actions/admin/enrollement";
import {getRecentCourses} from "@/actions/public/course";
import {AdminCoursesCards} from "@/app/admin/_components/admin-courses-cards";
import CardError from "@/components/custom-ui/CardError";
import AdminEnrollmentsCards from "@/app/admin/_components/admin-enrollments-cards";
import {AdminUsersCards} from "@/app/admin/_components/admin-users-cards";
import AdminCardStatsSkeletonLayout from "@/app/admin/_components/AdminCardStatsSkeletonLayout";
import {AdminCustomersCards} from "@/app/admin/_components/admin-customers-cards";

export default async function AdminIndexPage() {

    return (
        <>
            <Suspense fallback={<AdminCardStatsSkeletonLayout />}>
                <AdminCoursesCards/>
            </Suspense>

            <Suspense fallback={<AdminCardStatsSkeletonLayout />}>
                <AdminUsersCards/>
            </Suspense>

            <Suspense fallback={<AdminCardStatsSkeletonLayout />}>
                <AdminCustomersCards/>
            </Suspense>

            <Suspense fallback={<AdminCardStatsSkeletonLayout />}>
            <AdminEnrollmentsCards />
            </Suspense>

            <Suspense fallback={<RenderEnrollmentChartSkeletonLayout />}>
                <EnderEnrollmentsChart />
            </Suspense>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className={"text-xl font-semibold"}>Recent Courses</h2>
                    <Link href={"/admin/courses"}
                          className={buttonVariants({variant: "outline"})}>
                        View All Courses
                    </Link>
                </div>

                <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
                    <RenderRecentCourses/>
                </Suspense>
            </div>
        </>
    )
}

async function EnderEnrollmentsChart() {
    const response = await adminGetEnrollmentsStats();

    if(!response || response.status !== "success"){
        return <CardError message={"Impossible de charger les statistiques des enrollments."} title={"Erreur Chargement..."}/>
    }

    const enrollments = response.data;

    return <ChartAreaInteractive data={enrollments}/>
}

async function RenderRecentCourses() {
    const {data} = await getRecentCourses(4);

    if (data?.length === 0) {
        return (
            <EmptyState title={"No Courses Found"}
                        description={"You don't have any courses yet. Create a new course to get started."}
                        buttonText={"Create New Course"}
                        href={"/admin/courses/create"}
            />
        );
    }

    return (
        <div className="grid grid-cols-1  md:grid-cols-2  gap-6 ">
            {data?.map((course) => (
                <AdminCourseCard key={course.id} data={course}/>
            ))}
        </div>
    )
}

function RenderRecentCoursesSkeletonLayout(){

    return (
        <div className="grid grid-cols-1  md:grid-cols-2  gap-6 ">
            {Array.from({length: 2}).map((_, index) => (
                <AdminCourseCardSkeleton key={index}/>
            ))}
        </div>
    )
}


function RenderEnrollmentChartSkeletonLayout(){
    return (
        <div className="grid grid-cols-1  ">
                <AdminCourseCardSkeleton />
        </div>
    )

}

