import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {SchoolIcon, TimerIcon} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge';
import {cn} from "@/lib/utils";
import {calculatedPrice} from "@/lib/price";
import ProductPrice from '@/components/custom-ui/ProductPrice';
import { Course } from '@/models';
import {levelBgColors} from "@/lib/types";
import {useConstructUrl} from "@/hooks/use-construct-url";

interface Props {
    data: Course
    isEnrolled?: boolean
}

const PublicCourseCard = ({data, isEnrolled}:Props) => {

    const finalPrice = calculatedPrice(data.price!, data?.promotions?.[0])
    const thumbnailUrl  = useConstructUrl(data.fileKey);
    return (
        <Card className={"group  py-0 gap-0"}>
            <div className="relative flex-1">
                <Badge
                    className={cn(
                        "absolute top-2 right-2 text-foreground z-10",
                        levelBgColors[data.level] ?? "bg-accent" // fallback si non trouvé
                    )}
                >
                    {data.level}
                </Badge>
                <Image src={thumbnailUrl} alt={data.title} width={600} height={400} className={"w-full rounded-t-xl aspect-video h-full object-cover"}/>
            </div>
            <CardContent className={"p-4 flex-1"}>
                <Link href={`/courses/${data.slug}`}
                      className={"text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"}>
                    {data.title}
                </Link>
                <p className={"line-clamp-2 text-sm text-muted-foreground leading-tight mt-2"}>
                    {data.smallDescription}
                </p>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-x-5 ">
                        <div className="flex items-center gap-x-2">
                            <TimerIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                            <p className={"text-sm text-muted-foreground"}>{data.duration}h</p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <SchoolIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                            <p className={"text-sm text-muted-foreground"}>{data.categoryTitle}</p>
                        </div>
                    </div>

                    <ProductPrice finalPrice={finalPrice} price={data.price!} />
                </div>

                {isEnrolled ?
                    <Link href={`/dashboard/courses/${data.slug}`} className={buttonVariants({className: "w-full mt-4", variant: "blue"})}>
                        Watch Course
                    </Link>
                    :
                    <Link href={`/courses/${data.slug}`} className={buttonVariants({className: "w-full h-16 mt-4 ",
                        variant: "default"})}>Learn
                        More</Link>
                }

            </CardContent>
        </Card>
    );
};

export default PublicCourseCard;


export function PublicCourseCardSkeleton() {
    return <Card className={"group relative py-0 gap-0"}>
        <div className={"absolute top-2 right-2 z-10 flex items-center gap-2  "}>
            <Skeleton className={"h-6 w-20 rounded-full  bg-muted-foreground/10"}/>
        </div>
        <div className={" w-full relative h-fit"}>
            <Skeleton className={"w-full rounded-t-lg aspect-video h-[250px] object-cover  bg-muted-foreground/10"}/>
        </div>
        <CardContent className={"p-4"}>
            <div className="space-y-2">
                <Skeleton className={"h-6 w-full bg-muted-foreground/10 "}/>
                <Skeleton className={"w-3/4 h-6  bg-muted-foreground/10"}/>
            </div>

            <div className="mt-4 flex items-center gap-x-5">
                <div className="flex items-center gap-x-2">
                    <Skeleton className={"size-6 rounded-md  bg-muted-foreground/10"}/>
                    <Skeleton className={"h-4 w-8  bg-muted-foreground/10"}/>
                </div>
                <div className="flex items-center gap-x-2">
                    <Skeleton className={"size-6 rounded-md  bg-muted-foreground/10"}/>
                    <Skeleton className={"h-4 w-8  bg-muted-foreground/10"}/>
                </div>
            </div>
            <Skeleton className={buttonVariants({variant:'outline', className: "mt-4 h-10 w-full rounded"})}/>
        </CardContent>
    </Card>
}
