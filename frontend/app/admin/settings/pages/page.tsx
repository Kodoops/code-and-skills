import React from 'react';
import EmptyState from "@/components/general/EmptyState";
import {ArrowLeft, PlusIcon} from "lucide-react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import { buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/lib/utils";
import AdminPageCard from './_components/AdminPageCard';
import { adminGetPages } from '@/app/data/admin/get-pages';

const PagesSettings = async () => {

    const data = await adminGetPages()

    return (
        <div>
            { data === null || data.length === 0?
                <EmptyState title={"No pages found"}
                            description={"Please create one."}
                            buttonText={"Create Page"}
                            href={"/admin/settings/pages/create"}
                />
                :
                <>
                   <div className="flex justify-between items-center">
                       <Link href="/admin/pages"
                             className={cn(buttonVariants({variant: "default", className: "w-48 mb-6"}))}>
                           <ArrowLeft className={"size-4"}/>  Back to Settings
                       </Link>
                       <Link
                           href="/admin/settings/pages/create"
                           className={cn(buttonVariants({variant: "default",className: "w-36 mb-6"}))}
                       >
                          <PlusIcon className={"size-4"} /> Create Page</Link>
                   </div>
                    <div className={"grid grid-cols-2 gap-4"}>
                        {data?.map((item) => {

                            return <AdminPageCard key={item.id} item={item}/>
                        })}

                    </div>
                </>
            }

        </div>
    );
};

export default PagesSettings;


