import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardFooter, CardHeader} from "@/components/ui/card";
import {cn} from "@/lib/utils";

const AdminCardStatsSkeletonLayout = () => {

        return (
            <>
                <Skeleton className="w-48 h-8 rounded bg-muted-foreground/20"/>
                <div
                    className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 gap-4
                *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-3  lg:grid-cols-4  xl:grid-cols-5">

                    {Array.from({length: 5}).map((_, index) => (
                        <Card className={cn("@container/card")} key={ index}>
                            <CardHeader
                                className="flex flex-row items-center justify-between gap-2 space-y-0">
                                <div>
                                    <Skeleton className="w-32 h-4 rounded bg-muted-foreground/20"/>
                                    <Skeleton
                                        className="w-8 h-8 rounded-full bg-muted-foreground/20 mt-2 "/>

                                </div>
                                <div className="shrink-0">
                                    <Skeleton
                                        className="w-8 h-8 rounded-full bg-muted-foreground/20 "/>
                                </div>
                            </CardHeader>
                            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                <Skeleton className="w-32 h-4 rounded bg-muted-foreground/20"/>
                                <Skeleton className="w-16 h-4 rounded bg-muted-foreground/20"/>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </>
        )

};

export default AdminCardStatsSkeletonLayout;