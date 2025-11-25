import {
    IconBook,
    IconPlaylist,

} from "@tabler/icons-react"


import {adminGetDashboardCourseStats} from "@/actions/admin/dashboard";
import {StatCard} from "@/components/StatCard";
import EmptyState from "@/components/general/EmptyState";

export async function AdminCoursesCards() {


    const response = await adminGetDashboardCourseStats();
    if (!response || !response.data)
        return <EmptyState title={"Erreur Catalogue -Statistique "} description={response.message}/>

    const {data} = response;

    return (
        <>
            <h2>Courses stats</h2>


            <div
                className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 gap-4
                *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-3  lg:grid-cols-4  xl:grid-cols-5">
                <StatCard
                    label="Total Domains"
                    value={data?.domainsCount}
                    icon={<IconBook className="size-6 text-muted-foreground"/>}
                    helperText="Available domains on the platform"
                />
                <StatCard
                    label="Total Categories"
                    value={data?.categoriesCount}
                    icon={<IconBook className="size-6 text-muted-foreground"/>}
                    helperText="Available categories on the platform"
                />
            </div>

            <div
                className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 gap-4
                *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-3  lg:grid-cols-4  xl:grid-cols-5">
                <StatCard
                    label="Total Courses"
                    value={data?.coursesCount}
                    icon={<IconBook className="size-6 text-muted-foreground"/>}
                    helperText="Available courses on the platform"
                />
                <StatCard
                    label="Total Published Courses"
                    className="text-green-500"
                    value={data?.publishedCoursesCount}
                    icon={<IconBook className="size-6 text-muted-foreground"/>}
                    helperText="Available published courses on the platform"
                />
                <StatCard
                    label="Total Draft Courses"
                    className="text-orange-300"
                    value={data?.draftCoursesCount}
                    icon={<IconBook className="size-6 text-muted-foreground"/>}
                    helperText="Available draft courses on the platform"
                />

                <StatCard
                    label="Total Archived Courses"
                    className="text-muted-foreground"
                    value={data?.archivedCoursesCount}
                    icon={<IconBook className="size-6 text-muted-foreground"/>}
                    helperText="Available archived courses on the platform"
                />
            </div>

            <div
                className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 gap-4
                *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-3  lg:grid-cols-4  xl:grid-cols-5">
                <StatCard
                    label="Total Chapters"
                    value={data?.chaptersCount}
                    icon={<IconPlaylist className="size-6 text-muted-foreground"/>}
                    helperText="Total chapters content available"
                />
                <StatCard
                    label="Total Lessons"
                    value={data.lessonsCount}
                    icon={<IconPlaylist className="size-6 text-muted-foreground"/>}
                    helperText="Total learning content available"
                />
            </div>

        </>
    )
}
