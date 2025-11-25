import {
    IconBook,
    IconPlaylist,
    IconShoppingCart,
    IconUsers
} from "@tabler/icons-react"

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {CircleStar, RouteIcon} from "lucide-react";
import {adminGetDashboardCourseStats, adminGetDashboardUsersStats, getEnrollmentsStats} from "@/actions/admin/dashboard";
import {StatCard} from "@/components/StatCard";
import CardError from "@/components/custom-ui/CardError";
import EmptyState from "@/components/general/EmptyState";

export async function AdminUsersCards() {


    const response= await adminGetDashboardUsersStats();

    if (!response || !response.data)
        return <EmptyState title={"Erreur profile -Statistique "} description={response.message}/>

    const {data} = response;
    return (
        <>
            <h2>Users stats</h2>
            <div
                className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 gap-4
                *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-3  lg:grid-cols-4  xl:grid-cols-5">

                <StatCard
                    label="Total Signups"
                    value={data?.usersCount}
                    icon={<IconUsers className="size-6 text-muted-foreground"/>}
                    helperText="Registered users on the platform"
                />

                <StatCard
                    label="Total Premium Users"
                    value={data?.premiumUsersCount}
                    icon={<CircleStar className="size-6 text-muted-foreground"/>}
                    helperText="Users premium on the platform"
                />


            </div>
        </>
    )
}
