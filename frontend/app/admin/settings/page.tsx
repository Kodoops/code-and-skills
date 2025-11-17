import React, {Suspense} from 'react';
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {ArrowRightIcon, Cable, FileText} from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {buttonVariants} from "@/components/ui/button";

const SettingsPage = () => {


    return (
        <>
            <div className="flex flex-col items-start justify-start space-y-1">
                <h1 className={"text-2xl font-bold"}>Settings</h1>
                <p className={"text-sm text-muted-foreground"}>
                    All site settings
                </p>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Suspense fallback={<AdminSettingsSkeleton/>}>
                  <RenderAdminSettings/>
              </Suspense>

              <Suspense fallback={<AdminSettingsSkeleton/>}>
                  <RenderAdminPages/>
              </Suspense>
          </div>
        </>
    );
};

export default SettingsPage;


async function RenderAdminSettings() {

    return (
            <Card>
                <CardHeader className="space-y-2 text-center">
                    <Cable className="w-6 h-6 mx-auto"/>
                    <CardTitle>
                        <p>Social Networks</p>
                    </CardTitle>
                    <CardDescription>
                        manage social networks settings here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/admin/settings/social-networks"
                          className={cn(buttonVariants({className: "w-full"}))}>
                        Manage Social Networks <ArrowRightIcon className={"mr-1 size-4"}/>
                    </Link>
                </CardContent>
            </Card>
    )
}


function AdminSettingsSkeleton() {
    return (
        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
            {Array.from({length: 6}).map((_, index) => (
                <Card key={index}>
                    <CardHeader className="space-y-2 text-center">
                        <Skeleton className={"h-6 w-6 bg-muted-foreground/10 mx-auto"} />
                        <CardTitle>
                           <Skeleton className={"h-6 w-3/4 bg-muted-foreground/10 mx-auto"} />
                        </CardTitle>
                        <CardDescription>
                            <Skeleton className={"h-6 w-4/5 bg-muted-foreground/10 mx-auto"} />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className={"h-8 w-full bg-muted-foreground/10 mx-auto"} />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

async function RenderAdminPages() {

    return (
        <Card>
            <CardHeader className="space-y-2 text-center">
                <FileText className="w-6 h-6 mx-auto"/>
                <CardTitle>
                    <p>App Pages</p>
                </CardTitle>
                <CardDescription>
                    manage application pages & links here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/admin/settings/pages"
                      className={cn(buttonVariants({className: "w-full"}))}>
                    Manage App Pages <ArrowRightIcon className={"mr-1 size-4"}/>
                </Link>
            </CardContent>
        </Card>
    )
}
