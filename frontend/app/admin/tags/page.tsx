import React, {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import  {AdminCategoryCardSkeleton} from "@/app/admin/categories/_components/AdminCategoryCard";
import AdminTagCard from "./_components/AdminTagCard";
import Pagination from "@/components/general/Pagination";
import {TAGS_PER_PAGE} from "@/constants/admin-contants";
import { adminGetTagsPaginated} from "@/actions/admin/tags";
import CardError from "@/components/custom-ui/CardError";


const TagsPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "0", 10);

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Tags</h1>
                <Link href={"/admin/tags/create"}
                      className={buttonVariants()}>
                    Create Tag
                </Link>
            </div>
            <Suspense fallback={<AdminTagCardSkeletonLayout />}>
                <RenderTags current={page} nbrPage={TAGS_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default TagsPage;

async function RenderTags({current, nbrPage}: { current?: number | undefined, nbrPage: number }) {

    const response = await adminGetTagsPaginated(current, nbrPage);

    if (!response) {
        return <CardError message={"❌Impossible de charger les tags."} title={"Erreur chargement des tags"} />
    }
    const data = response?.data?.content;
    const totalPages = response?.data?.totalPages;
    const page = response?.data?.currentPage

    return (
        <>
            {data?.length === 0 ?
                <EmptyState title={"No Tags Found"}
                            description={"You don't have any tag yet. Create a new tag to get started."}
                            buttonText={"Create Tag"}
                            href={"/admin/tags/create"}
                />
                :
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {data?.map((tag) => {

                                return <AdminTagCard key={tag.id} id={tag.id} title={tag.title} color={tag.color} />
                            }
                        )}
                    </div>
                    {totalPages && totalPages > 1 && <Pagination page={page??1} totalPages={totalPages}/>}
                </>
            }
        </>
    )
}

function AdminTagCardSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
            {Array.from({length: 4}).map((_, index) => (
                <AdminCategoryCardSkeleton key={index}/>
            ))}
        </div>
    )

}
