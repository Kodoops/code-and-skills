"use client";

import React, {useCallback, useEffect, useState} from 'react';
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge';
import {useCourseProgress} from "@/hooks/use-course-progress";
import {Progress} from "@/components/ui/progress";
import {PlayIcon, SchoolIcon, TimerIcon} from "lucide-react";
import {Course} from "@/models";
import {useConstructUrl} from "@/hooks/use-construct-url";

interface Props {
    data: Course
}

const CourseProgressCard = ({data}:Props) => {
    const progress = useCourseProgress({ courseData: data });
    const imageFile = useConstructUrl(data.fileKey);

    // const reloadProgress = useCallback(() => {
    //     progress.reload();
    // }, [progress]);


    return (
        <Card className={"group relative py-0 gap-0"}>

            <Badge className={"absolute top-2 right-2 bg-primary/40 text-primary z-10"}>
                {data.level}
            </Badge>

            <Image src={imageFile} alt={data.title} width={600} height={400} className={"w-full rounded-t-xl aspect-video h-full object-cover"}/>

            <CardContent className={"p-4"}>
                <Link href={`/dashboard/courses/${data.slug}`} className={"text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"}>
                    {data.title}
                </Link>
                <p className={"line-clamp-2 text-sm text-muted-foreground leading-tight mt-2"}>
                    {data.smallDescription}
                </p>
                <div className="flex items-center gap-x-5 mt-4">
                    <div className="flex items-center gap-x-2">
                        <TimerIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                        <p className={"text-sm text-muted-foreground"}>{data.duration}h</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <SchoolIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                        <p className={"text-sm text-muted-foreground"}>{data.categoryTitle}</p>
                    </div>
                </div>
                <div className="space-y-4 mt-5 flex  items-start justify-between gap-2">
                    <div
                        className="flex-1 border border-muted-foreground/10 pb-4 p-1 bg-muted-foreground/10 rounded-lg">
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <p className={"text-xs text-muted-foreground"}>
                                Progress ( {progress.completedLessons} of {progress.totalLessons} lessons completed )
                            </p>
                            <p className="font-medium text-xs">{progress.progressPercentage ? progress.progressPercentage.toFixed(0) : 0}%</p>
                        </div>
                        <Progress value={progress.progressPercentage || 0} className={"h-1.5 "}/>
                        {/*<p className={"text-xs text-muted-foreground mt-1"}>*/}
                        {/*    {progress.completedLessons} of {progress.totalLessons} lessons completed*/}
                        {/*</p>*/}

                    </div>
                    <Link href={`/dashboard/courses/${data.slug}`}
                          className={buttonVariants({className: " h-12", variant: "blue"})}>
                        <PlayIcon className={"size-6"}/>
                    </Link>
                </div>

            </CardContent>
        </Card>
    );
};

export default CourseProgressCard;

export function CourseProgressCardSkeleton() {
    return <Card className={"group relative py-0 gap-0"}>
    <div className={"absolute top-2 right-2 z-10 flex items-center gap-2"}>
            <Skeleton className={"h-6 w-20 rounded-full bg-muted-foreground/10"}/>
            <Skeleton className={"size-8 rounded-md  bg-muted-foreground/10"}/>
        </div>
        <div className={" w-full relative h-fit"}>
            <Skeleton className={"w-full rounded-t-lg aspect-video h-[250px] object-cover  bg-muted-foreground/10"}/>
        </div>
        <CardContent className={"p-4"}>
            <div className="space-y-2">
                <Skeleton className={"h-6 w-full  bg-muted-foreground/10 "}/>
                <Skeleton className={"w-3/4 h-6 "}/>
            </div>

            <div className="mt-4 flex items-center gap-x-5">
                <div className="flex items-center gap-x-2">
                    <Skeleton className={"size-6 rounded-md"}/>
                    <Skeleton className={"h-4 w-8 "}/>
                </div>
                <div className="flex items-center gap-x-2">
                    <Skeleton className={"size-6 rounded-md"}/>
                    <Skeleton className={"h-4 w-8 "}/>
                </div>
            </div>
            <Skeleton className={buttonVariants({className: "mt-4 h-10 w-full rounded"})}/>
        </CardContent>
    </Card>
}
