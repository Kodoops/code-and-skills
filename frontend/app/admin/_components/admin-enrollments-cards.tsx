import React from 'react';
import {getEnrollmentsStats} from "@/actions/admin/dashboard";
import CardError from "@/components/custom-ui/CardError";
import {StatCard} from "@/components/StatCard";
import {IconBook, IconPlaylist, IconShoppingCart, IconUsers} from "@tabler/icons-react";
import {RouteIcon} from "lucide-react";

const AdminEnrollmentsCards = async () => {

    const response = await getEnrollmentsStats();
    if (!response || response.status !== "success") {
        return <CardError message={response.message || "Erreur de réccupéraation des stats des enrollments"}
                          title={"Erreur Chargement..."}/>
    }
    const {
        totalCoursesEnrollments,
        totalEnrollments,
        totalPathsEnrollments,
        totalSubscriptions,
        totalWorkshopsEnrollments
    } = response.data;
    return (
        <>
            <h2>Enrollments stats</h2>
            <div
                className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 gap-4
                *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-3  lg:grid-cols-4  xl:grid-cols-5">
                <StatCard
                    label="Total Achats"
                    value={totalEnrollments}
                    icon={<IconUsers className="size-6 text-muted-foreground"/>}
                    helperText="Registered users on the platform"
                />

                <StatCard
                    label="Total des achats de cours"
                    value={totalCoursesEnrollments}
                    icon={<IconShoppingCart className="size-6 text-muted-foreground"/>}
                    helperText="Users who enrolled in courses"
                />

                <StatCard
                    label="Total des achats de parcours"
                    value={totalPathsEnrollments}
                    icon={<IconBook className="size-6 text-muted-foreground"/>}
                    helperText="Available courses on the platform"
                />

                <StatCard
                    label="Total des achats d'ateliers"
                    value={totalWorkshopsEnrollments}
                    icon={<IconPlaylist className="size-6 text-muted-foreground"/>}
                    helperText="Total learning content available"
                />

                <StatCard
                    label="Total des achats des inscriptions"
                    value={totalSubscriptions}
                    icon={<RouteIcon className="size-6 text-muted-foreground"/>}
                    helperText="Available Learning paths on the platform"
                />
            </div>
        </>
    );
};

export default AdminEnrollmentsCards;