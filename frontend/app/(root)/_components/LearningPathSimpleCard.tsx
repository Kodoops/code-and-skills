"use client";

import React from "react";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { buttonVariants} from "@/components/ui/button";
import {FileArchive, FileTextIcon, ImageIcon, LinkIcon, SchoolIcon, TimerIcon, Youtube} from "lucide-react";
import ProductPrice from "@/components/custom-ui/ProductPrice";
import {useConstructUrl} from "@/hooks/use-construct-url";
import {calculatedPrice} from "@/lib/price";
import {Skeleton} from "@/components/ui/skeleton";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {LearningPath} from "@/models";
import {levelBgColors} from "@/lib/types";

export default function LearningPathSimpleCard({
                                             data,
                                             isEnrolled,
                                         }: {
    data: LearningPath;
    isEnrolled: boolean;
}) {

    const previewUrl = useConstructUrl(data.fileKey!);

    const finalPrice = calculatedPrice(data.price!, data?.promotions?.[0])

    const courses = data.contents
        .filter((c: any) => c.course !== null)
        .map((c: any) => c.course);

    const workshops = data.contents
        .filter((c: any) => c.workshop !== null)
        .map((c: any) => c.workshop);

    const resources = data.contents
        .filter((c: any) => c.resource !== null)
        .map((c: any) => c.resource);

    const renderIconFile = (type: string) =>{
        if(type === "video"){
            return  <Youtube className={"size-3"} />
        }
        if(type === "zip" || type === "tar" ){
            return  <FileArchive className={"size-3"} />
        }

        if(type === "link"  ){
            return  <LinkIcon className={"size-3"} />
        }

        if(type === "image"  ){
            return  <ImageIcon className={"size-3"} />
        }

        return <FileTextIcon className={"size-3"} />
    }
    return (
        <Card className="max-w-4xl mx-auto p-6 space-y-2 rounded-xl border shadow-md">

            <div className="relative flex-1">
                <Badge
                    className={cn(
                        "absolute top-2 right-2 text-foreground z-10",
                        levelBgColors[data.level] ?? "bg-accent" // fallback si non trouvé
                    )}
                >
                    {data.level}
                </Badge>
                <Image
                    src={previewUrl}
                    alt={data.title}
                    className="max-w-full max-h-64 object-cover rounded-lg aspect-video"
                    width={800}
                    height={800}
                />
            </div>
            <CardHeader>
                <CardTitle>
                    <h2 className="text-2xl font-bold">Parcours : Développeur Frontend</h2>
                </CardTitle>
                <CardDescription>
                    <p className="text-muted-foreground">
                        Un parcours complet pour maîtriser les bases du développement web moderne avec HTML,
                        CSS, JavaScript et projets concrets.
                    </p>

                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-x-5 ">
                        <div className="flex items-center gap-x-2">
                            <TimerIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                            <p className={"text-sm text-muted-foreground"}>{20}h</p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <SchoolIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                            <p className={"text-sm text-muted-foreground"}>FrontEnd</p>
                        </div>
                    </div>

                    <ProductPrice finalPrice={finalPrice} price={data.price!}/>
                </div>
                <div className="flex items-center justify-start gap-4">
                    <span className={"text-muted-foreground/70 text-sm "}>Contenu :</span>
                    {courses && courses.length > 0 && <Badge variant={"outline"}>Courses : {courses.length}</Badge>}
                    {workshops && workshops.length > 0 && <Badge variant={"outline"}>Workshops : {workshops.length}</Badge>}
                    {resources && resources.length > 0 && <Badge variant={"outline"}>Resources : {resources.length}</Badge>}
                </div>
            </CardContent>

            <CardFooter>
                {isEnrolled ?
                    <Link href={`/dashboard/learning-paths/${data.slug}`}
                          className={buttonVariants({className: "w-full mt-4", variant: "blue"})}>
                        Follow Learning Path
                    </Link>
                    :
                    <Link href={`/learning-paths/${data.slug}`} className={buttonVariants({className: "w-full mt-4"})}>Learn
                        More</Link>
                }
            </CardFooter>
        </Card>
    );
}

export function LearningPathSkeletonSimpleCard() {
    return (
        <Card className="w-full  p-6 space-y-1 rounded-xl border shadow-md">
            <Skeleton className="max-w-full max-h-64 object-cover rounded-lg aspect-video bg-muted-foreground/10"/>
            <Skeleton className="max-w-full h-10 bg-muted-foreground/10"/>
            <div className="">
                <Skeleton className="max-w-full h-6 bg-muted-foreground/10"/>
                <Skeleton className="max-w-3/4 h-6 bg-muted-foreground/10"/>
            </div>
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-x-5">
                    <Skeleton className="w-24 h-6 bg-muted-foreground/10"/>
                    <Skeleton className="w-24 h-6 bg-muted-foreground/10"/>
                </div>
                <Skeleton className="w-32 h-6 bg-muted-foreground/10"/>
            </div>

            <Skeleton className="w-full h-10 bg-muted-foreground/10"/>
        </Card>
    )
}
