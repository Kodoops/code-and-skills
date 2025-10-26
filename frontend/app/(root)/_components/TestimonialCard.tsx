// components/ui/TestimonialCard.tsx
import React from "react";
import Stars from "../../../components/custom-ui/Stars";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {RatingStars} from "@/components/custom-ui/RatingStars";
import {Skeleton} from "@/components/ui/skeleton";

export default function TestimonialCard({
                                            name, role, text, rating = 5, avatar
                                        }: {
    name: string; role: string; text: string; rating?: number; avatar?: string;
}) {
    return (
        <Card className={"my-4"}>
            <CardHeader>
                <RatingStars rating={rating}/>
            </CardHeader>
            <CardContent>
                <p className="mt-3 text-sm  line-clamp-2">“{text}”</p>
                <div className="mt-4 flex items-center gap-3">
                    <div className=" border-border border-2 rounded-full p-1">
                        {avatar ? (
                            <img src={avatar} alt={name} className="h-9 w-9 rounded-full object-cover"/>
                        ) : (
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted-foreground/20">👤</div>
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-semibold">{name}</div>
                        <div className="text-xs text-muted-foreground/70">{role}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function TestimonialCardSkeleton() {
    return (
        <Card className={"my-4"}>
            <CardHeader>
                <Skeleton className={"w-1/3 h-4 rounded-full bg-foreground/10"}/>
            </CardHeader>
            <CardContent>
                <Skeleton className={"w-3/4 h-4 rounded-full bg-foreground/10"}/>
                <div className="mt-4 flex items-center gap-3">

                    <Skeleton className="flex h-9 w-9 items-center justify-center rounded-full bg-muted-foreground/20"/>
                    <div className="flex-1 space-y-1" >
                        <Skeleton className={"w-1/2 h-4 rounded-full bg-muted-foreground/20"}/>
                        <Skeleton className={"w-3/4 h-4 rounded-full bg-muted-foreground/20"}/>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
