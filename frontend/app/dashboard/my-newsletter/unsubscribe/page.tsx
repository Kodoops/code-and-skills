"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button, buttonVariants} from '@/components/ui/button';
import {useRouter, useSearchParams} from "next/navigation";
import {Loader2, Trash2} from "lucide-react";
import {unsubscribeNewsletter} from "@/actions/auth/newsletter";
import {handleActionResult} from "@/lib/handleActionResult";


const UnsubscribeNewsletter = () => {

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const searchParams =useSearchParams();

    function onSubmit() {

        startTransition(async () => {
            const result = await unsubscribeNewsletter(searchParams.get("email") as string);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Inscription supprimée  !");
                    router.push("/dashboard/my-newsletter");
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });

        });
    }

    return (
        <div className={"max-w-xl mx-auto w-full"}>
            <Card className={"mt-32"}>
                <CardHeader>
                    <CardTitle>Are you sure you want to unsubscribe from our news letter ?</CardTitle>
                    <CardDescription >
                        This action is irreversible. this will delete  the newsletter subscription .
                    </CardDescription>
                </CardHeader>
                <CardContent className={"flex items-center justify-between gap-4"}>
                    <Link href={"/dashboard/my-newsletter"} className={buttonVariants({variant: "outline"})}>
                        Cancel
                    </Link>
                    <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
                        {pending ? <> <Loader2 className={"size-4 animate-spin"}/> Unsubscribing ... </> :
                            <> <Trash2 className={"size-4"}/>Unsubscribe </>}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default UnsubscribeNewsletter;
