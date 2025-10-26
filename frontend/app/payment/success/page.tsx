"use client";

import React, {useEffect} from 'react';
import {Card} from "@/components/ui/card";
import {ArrowLeft, CheckIcon} from "lucide-react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {useConfetti} from "@/hooks/use-confetti";

const SuccessPaymentPage = () => {

    const { triggerConfetti } = useConfetti();

    useEffect(() => {
        triggerConfetti();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="h-screen w-ful flex flex-1 justify-center items-center">
            <Card className={"w-[350px] p-4"} >
                <div className="w-full flex justify-center items-center">
                    <CheckIcon className={"size-16 p-2 bg-green-500/30 rounded-full text-green-500"}/>
                </div>
                <div className="mt-3 text-center sm:mt-5 w-full" >
                    <h2 className={"text-xl font-semibold"}>Payment Success</h2>
                    <p className={"text-sm text-muted-foreground tracking-tight text-balance"}>
                       Congrats your payment was successfully , you should now be able to access the content.
                    </p>

                    <Link href={"/dashboard"} className={buttonVariants({className: "w-full mt-5"})}>
                        <ArrowLeft className={"mr-1 size-4"}/>
                        Go to Dashboard
                    </Link>

                </div>
            </Card>
        </div>
    );
};

export default SuccessPaymentPage;
