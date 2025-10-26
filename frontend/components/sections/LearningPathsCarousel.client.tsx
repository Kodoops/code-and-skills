"use client";
import React from "react";
import CarouselGrid from "../../app/(root)/_components/CarouselGrid";
import LearningPathSimpleCard from "@/app/(root)/_components/LearningPathSimpleCard";
import { LearningPath } from "@/models";



export default function LearningPathsCarouselClient({
                                                  items,
                                                  perPage = 2,
                                                  alreadyEnrolled
                                              }: {
    items: LearningPath[];
    alreadyEnrolled: string[]
    perPage?: number;
}) {

    return (
        <CarouselGrid
            items={items}
            perPage={perPage}
            grid={{ baseCols: 1, smCols: 1, lgCols: 2 }}
            itemKey={(c) => c.id}
            renderItem={(c, index) => (

                <LearningPathSimpleCard data={c} isEnrolled={alreadyEnrolled.includes(c.id)} />
            )}
        />
    );
}
