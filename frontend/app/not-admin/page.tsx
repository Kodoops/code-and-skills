import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft, ShieldXIcon} from "lucide-react";
import Link from 'next/link';
import {buttonVariants} from "@/components/ui/button";

const NotAdminPage = () => {
    return (
        <div className="h-screen flex items-center justify-center bg-background">
            <Card className="max-w-md w-full">
                <CardHeader className="flex flex-col items-center">
                    <div className="bg-destructive/10 rounded-full p-4">
                        <ShieldXIcon className="size-16 text-destructive"/>
                    </div>
                    <CardTitle className="mt-4 text-2xl font-semibold text-center">Access Restricted</CardTitle>
                    <CardDescription className="text-muted-foreground text-center max-w-xs mx-auto">
                        You do not have admin privileges to view this page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href={"/"} className={buttonVariants({className: "w-full"})}  >
                        <ArrowLeft className={"mr-1 size-4"}/> Back to Home
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotAdminPage;
