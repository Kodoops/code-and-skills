import React, {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import Pagination from "@/components/general/Pagination";
import { PAGES_PER_PAGE} from "@/constants/admin-contants";
import CardError from "@/components/custom-ui/CardError";
import AdminPageCard, { AdminPageCardSkeleton } from "./_components/AdminPageCard";
import {getAllPages} from "@/actions/admin/page";


const PagesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
        type?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", PAGES_PER_PAGE);
    const type = params?.type;
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Pages</h1>
                <Link href={"/admin/pages/create"}
                      className={buttonVariants()}>
                    Create Page
                </Link>
            </div>
            <Suspense fallback={<AdminPageCardSkeletonLayout />}>
                <RenderPages current={page-1} nbrPage={PAGES_PER_PAGE} type={type}/>
            </Suspense>
        </>
    );
}

export default PagesPage;

async function RenderPages({current, nbrPage, type}: { current?: number | undefined, nbrPage: number , type?: string | undefined}) {

    const response =  await getAllPages(current, nbrPage, type);

    if(!response || response?.status==="error"){
        return <CardError message={response?.message } title={"Erreur chargement des pages"} />
    }

    return (
        <>
            {response.data?.content.length === 0 ?
                <EmptyState title={"No Page Found"}
                            description={"You don't have any page yet. Create a new  to get started."}
                            buttonText={"Create Page"}
                            href={"/admin/pages/create"}
                />
                :
                <>
                    <div className="grid grid-cols-1  lg:grid-cols-2  gap-4">
                        {response.data?.content.map((page) => {

                                return <AdminPageCard key={page.id} {...page} />
                            }
                        )}
                    </div>
                    {response.data?.totalPages && response.data?.totalPages > 1 &&
                        <Pagination page={response.data?.currentPage+1} totalPages={response.data?.totalPages}/>}
                </>
            }
        </>
    )
}

function AdminPageCardSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 6}).map((_, index) => (
                <AdminPageCardSkeleton key={index}/>
            ))}
        </div>
    )

}
