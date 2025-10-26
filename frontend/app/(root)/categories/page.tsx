import React, {Suspense} from 'react';
import CategoryCard, {CategoryCardSkeleton} from "@/app/(root)/_components/CategoryCard";
import Pagination from "@/components/general/Pagination";
import {getPaginatedCategories} from "@/actions/public/category";
import CardError from '@/components/custom-ui/CardError';

export const dynamic = "force-dynamic"

const COURSES_PER_PAGE = 16;

const CategoriesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);


    return (
        <div className=" flex-1 pt-5">
            <div className="mb-10 px-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Explore Categories</h1>
                <p className={"text-muted-foreground "}>Discover our wide range of categories grouping a courses</p>
            </div>

            <div className=" px-4 overflow-y-auto">
                <Suspense fallback={<LoadingSkeletonLayout/>}>
                    <RenderCategories current={page} nbrPage={COURSES_PER_PAGE} />
                </Suspense>
            </div>
        </div>
    )
        ;
};

export default CategoriesPage;


async function RenderCategories({current, nbrPage}: {current?: number | undefined, nbrPage: number}) {

    const  result = await getPaginatedCategories(current, nbrPage);

    if(!result) {
        return <CardError message={"Impossible de réccupérer les cétagories"} title={"Erreur de chargement"} />
    }

    return (
        <>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
                {result.data?.content.map((category) => (
                    <CategoryCard
                        key={category.id}
                        title={category.title}
                        slug={category.slug}
                        description={category.description}
                        iconName={category.iconName ?? undefined}
                        iconLib={category.iconLib ?? undefined}
                        color={category.color ?? undefined}
                        // count={category.count} // si tu en as un
                    />
                ))}
            </div>
            { result.data && result.data.totalPages >1 && <Pagination page={result.data?.currentPage} totalPages={result.data?.totalPages}/>}
        </>
    )
}

function LoadingSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {Array.from({length: 16}).map((_, index) => (
                <CategoryCardSkeleton key={index}/>
            ))}
        </div>
    )
}
