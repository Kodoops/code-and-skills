import React, {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import  {
    AdminCategoryCardSkeleton,
    AdminDomainCard
} from "@/app/admin/categories/_components/AdminCategoryCard";
import Pagination from "@/components/general/Pagination";
import {DOMAINS_PER_PAGE} from "@/constants/admin-contants";
import {adminGetDomains} from "@/actions/admin/domain";
import CardError from "@/components/custom-ui/CardError";
import {Domain} from "@/models";


const DomainsPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "0", 10);

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Domains</h1>
                <Link href={"/admin/domains/create"}
                      className={buttonVariants()}>
                    Create Domain
                </Link>
            </div>
            <Suspense fallback={<AdminCategoryCardSkeletonLayout/>}>
                <RenderDomains current={page} nbrPage={DOMAINS_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default DomainsPage;

async function RenderDomains({current, nbrPage}: { current?: number | undefined, nbrPage: number }) {

    const response = await adminGetDomains(current, nbrPage);

    if (!response) {
        return <CardError message={"❌Impossible de charger les domaines."} title={"Erreur chargement des domaines"} />
    }
    const data = response?.data?.content;
    const totalPages = response?.data?.totalPages;
    const page = response?.data?.currentPage

    return (
        <>
            {data?.length === 0 ?
                <EmptyState title={"No Domains Found"}
                            description={"You don't have any domain yet. Create a new domain to get started."}
                            buttonText={"Create Domain"}
                            href={"/admin/domains/create"}
                />
                :
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
                        {data?.map((domain: Domain) => {
                                return <AdminDomainCard key={domain.id} {...domain} />
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
