import React from 'react';
import Link from "next/link";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowRightIcon, Cable, KeyIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";

const Page = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <Card>
                <CardHeader className="space-y-2 text-center">
                    <KeyIcon className="w-6 h-6 mx-auto"/>
                    <CardTitle>
                        <p>Sécurité</p>
                    </CardTitle>
                    <CardDescription>
                        manage password and security settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard/settings/security"
                          className={cn(buttonVariants({className: "w-full"}))}>
                       Manage your Sécurity <ArrowRightIcon className={"mr-1 size-4"}/>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;