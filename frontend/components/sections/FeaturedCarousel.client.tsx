"use client";
import React from "react";

import {FeaturedType} from "@/lib/db/types.ts";
import CarouselGrid from "@/app/(root)/_components/CarouselGrid";
import FeatureCard from "@/app/(root)/_components/FeatureCard";

export default function FeaturedCarouselClient({
                                                  items,
                                                  perPage = 3,
                                              }: {
    items: FeaturedType[];
    perPage?: number;
}) {
    return (
        <CarouselGrid
            items={items}
            perPage={perPage}
            grid={{ baseCols: 1, smCols: 2, lgCols: 3 }}
            itemKey={(c) => c.title}
            renderItem={(c) => (
                <FeatureCard
                    title={c.title}
                    desc={c.desc}
                    iconName={c.iconName}
                    iconLib={c.iconLib}
                    color={c.color}
                />
            )}
        />
    );
}
