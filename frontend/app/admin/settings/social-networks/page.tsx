import React from 'react';
import EmptyState from "@/components/general/EmptyState";
import {ArrowLeft} from "lucide-react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import { buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/lib/utils";
import { AdminSocialNetworkCard } from './_components/AdminSocialNetworkCard';
import {adminGetSocialNetworks} from "@/actions/admin/social-networks";
import CardError from "@/components/custom-ui/CardError";

const SocialLinksSettings = async () => {

    const result = await adminGetSocialNetworks()

    if(!result || result.status !== "success") return <CardError message={ result.message}  title={"Error Social links"}/>

    const data = result.data;

    return (
        <div>
            { data === null || data.content.length === 0?
                <EmptyState title={"No social networks found"}
                            description={"Please create one."}
                            buttonText={"Create Social Network"}
                            href={"/admin/settings/social-networks/create"}
                />
                :
                <>
                    <Link href="/admin/settings"
                          className={cn(buttonVariants({variant: "default", className: "w-48 mb-6"}))}>
                        <ArrowLeft className={"size-4"}/>  Back to Settings
                    </Link>
                    <div className={"grid grid-cols-4 gap-4"}>
                        {data?.content.map((item) => {

                            return <AdminSocialNetworkCard key={item.id} item={item}/>
                        })}

                        <Card className={"text-center"}>
                            <CardHeader className={"flex justify-center"}>
                                <Skeleton className={"bg-muted-foreground/10 w-12 h-12 rounded-full"}/>
                            </CardHeader>
                            <CardContent>
                                <Link
                                    href="/admin/settings/social-networks/create"
                                    className={cn(buttonVariants({variant: "default", className: "w-full"}))}
                                >
                                    Create Social Network</Link>
                            </CardContent>
                        </Card>
                    </div>
                </>
            }

        </div>
    );
};

export default SocialLinksSettings;


