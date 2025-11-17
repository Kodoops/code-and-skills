import React, {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import AdminCategoryCard, {AdminCategoryCardSkeleton} from "@/app/admin/categories/_components/AdminCategoryCard";
import Pagination from "@/components/general/Pagination";
import {CATEGORIES_PER_PAGE} from "@/constants/admin-contants";
import {adminGetCategories} from "@/actions/admin/categories";
import CardError from "@/components/custom-ui/CardError";
import { Category } from "@/models";


const CategoriesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "0", 10);

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Categories</h1>
                <Link href={"/admin/categories/create"}
                      className={buttonVariants()}>
                    Create Category
                </Link>
            </div>
            <Suspense fallback={<AdminCategoryCardSkeletonLayout/>}>
                <RenderCategories current={page} nbrPage={CATEGORIES_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default CategoriesPage;

async function RenderCategories({current, nbrPage}: { current?: number | undefined, nbrPage: number }) {

    const response = await adminGetCategories({page:current, size:nbrPage});

    if (!response) {
        return <CardError message={"❌ Impossible de charger les catégories."} title={"Erreur chargement des catégories"} />
    }

    const data = response?.data?.content;
    const totalPages = response?.data?.totalPages;
    const page = response?.data?.currentPage

    return (
        <>
            {data?.length === 0 ?
                <EmptyState title={"No Categories Found"}
                            description={"You don't have any category yet. Create a new category to get started."}
                            buttonText={"Create Category"}
                            href={"/admin/categories/create"}
                />
                :
                <>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
                        {data?.map((category:Category) => {

                                return <AdminCategoryCard key={category.id} {...category} />
                            }
                        )}
                    </div>

                    {totalPages && totalPages > 1 && <Pagination page={page??1} totalPages={totalPages}/>}
                </>
            }
        </>
    )
}

function AdminCategoryCardSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
            {Array.from({length: 4}).map((_, index) => (
                <AdminCategoryCardSkeleton key={index}/>
            ))}
        </div>
    )

}
