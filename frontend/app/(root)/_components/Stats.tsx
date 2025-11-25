import React from 'react';
import {Card} from "@/components/ui/card";
import {getStats} from '@/actions/stats';
import {Skeleton} from "@/components/ui/skeleton";
import EmptyState from "@/components/general/EmptyState";
import {SimpleStatistics} from "@/lib/types";

const Stats = async () => {
    const response = await getStats();
    if (!response || !response.data) {
        return <div className="mt-10 grid w-full max-w-4xl grid-cols-1 ">
            <EmptyState
                title={"Error Statistics"}
                description={response.code && response.code === 503 ? "Service is temporarily unavailable " : response.message}
            />
        </div>
    }

    const courses: number = response?.data.courses || 0;
    const lessons = response?.data.lessons || 0;
    const quizzes = response?.data.quizzes || 0;

    return (
        <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
                {k: `+ ${lessons}`, v: "Leçons vidéos / Articles"},
                {k: `+ ${courses}`, v: "Formations / Parcours"},
                {k: `+ ${quizzes}`, v: "Exercices / Quiz"},
                {k: "100%", v: "Pratique & Support"},
            ].map((s) => (
                <Card key={s.v}>
                    <div className="text-2xl font-extrabold">{s.k}</div>
                    <div className="text-xs text-muted-foreground">{s.v}</div>
                </Card>
            ))}
        </div>
    );
};

export default Stats;


export function StatsSkeletonLayout() {

    return (
        [1, 2, 3].map((index) => (
            <Card key={index}>
                <Skeleton className="mx-auto h-8 w-8  bg-muted-foreground/20 rounded-full"/>
                <Skeleton className="mx-4 h-8 w-auto bg-muted-foreground/20 rounded"/>
            </Card>
        ))
    )
        ;
}