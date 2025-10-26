"use client";
import React from "react";
import {TestimonialType, TestimonialWithUserType} from "@/lib/db/types.ts";
import CarouselGrid from "../../app/(root)/_components/CarouselGrid";
import TestimonialCard from "../../app/(root)/_components/TestimonialCard";


export default function TestimonialCarouselClient({
                                                   items,
                                                   perPage = 3,
                                               }: {
    items: TestimonialWithUserType[];
    perPage?: number;
}) {
    return (
        <CarouselGrid
            items={items}
            perPage={perPage}
            grid={{baseCols: 1, smCols: 2, lgCols: 3}}
            itemKey={(c) => c.user.name!}
            renderItem={(c) => (

                <TestimonialCard
                    name={c.user.name!}
                    role={c.user.email!}
                    rating={c.rating}
                    text={c.text}
                    avatar={c.user.image!}
                />
            )}
        />
    );
}
