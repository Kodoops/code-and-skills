
import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import Link from "next/link";
import {
   LinkIcon,
} from "lucide-react";
import { buttonVariants} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {QuizType} from "@/lib/db/types.ts";


interface AddQuizCardProps {
    data: QuizType;
}

const AddQuizCard = ({data}: AddQuizCardProps) => {

    return (
        <Card className="group relative py-1 gap-0 border-none bg-muted-foreground/10">
            <CardContent className="p-4">
                <Link href={`/admin/quiz/${data.id}/edit`}
                      className={"group-hover:text-primary transition-colors font-medium text-lg line-clamp-2 hover:underline"}>
                    {data.title}
                </Link>
                <p className="line-clamp-2 text-xm text-muted-foreground leading-tight mt-2">
                    {data.description}
                </p>
            </CardContent>
        </Card>
    );
};

export default AddQuizCard;

export function AddQuizCardSkeleton() {
    return <Card className="group relative py-1 gap-0">
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2" >
            <Skeleton  className={"h-6 w-16 rounded-full bg-foreground/10"}/>
        </div>

        <CardContent className="p-4">
            <Skeleton  className={"h-6 w-3/4 mt-2 rounded bg-foreground/10"}/>
            <Skeleton  className={"w-full h-4 mt-4 rounded bg-foreground/10"}/>

            <Skeleton  className={buttonVariants({variant:'outline',className: "mt-4 h-10 w-full rounded"})}/>
        </CardContent>
    </Card>
}
