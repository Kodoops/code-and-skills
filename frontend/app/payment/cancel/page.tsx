import React from 'react';
import {Card} from "@/components/ui/card";
import {ArrowLeft, XIcon} from "lucide-react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

const CancelPaymentPage = () => {
    return (
        <div className="h-screen w-ful flex flex-1 justify-center items-center">
        <Card className={"w-[350px] p-4"} >
            <div className="w-full flex justify-center items-center">
                <XIcon className={"size-16 p-2 bg-destructive/30 rounded-full text-destructive"}/>
            </div>
            <div className="mt-3 text-center sm:mt-5 w-full" >
                <h2 className={"text-xl font-semibold"}>Payment Cancelled</h2>
                <p className={"text-sm text-muted-foreground tracking-tight text-balance"}>
                    No worries, you wont be charged, please try again!
                </p>

                <Link href={"/"} className={buttonVariants({className: "w-full mt-5"})}>
                    <ArrowLeft className={"mr-1 size-4"}/>
                    Go back to Homepage
                </Link>

            </div>
        </Card>
        </div>
    );
};

export default CancelPaymentPage;
