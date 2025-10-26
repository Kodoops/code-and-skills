"use client";
import React from "react";
import CarouselGrid from "../../app/(root)/_components/CarouselGrid";
import CategoryCard from "@/app/(root)/_components/CategoryCard";
import {Category} from "@/models";


export default function CategoriesCarouselClient({
                                                     items,
                                                     perPage = 4,
                                                 }: {
    items: Category[];
    perPage?: number;
}) {
    return (
        <CarouselGrid
            items={items}
            perPage={perPage}
            grid={{ baseCols: 2, smCols: 4, lgCols: perPage }}
            itemKey={(c) => c.title}
            renderItem={(c) => (
                <CategoryCard
                    title={c.title}
                    description={c.description}
                    slug={ c.slug}
                    iconName={c.iconName}
                    iconLib={c.iconLib}
                    color={c.color}
                />
            )}
        />
    );
}
