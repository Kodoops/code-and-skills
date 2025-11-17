"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button, buttonVariants} from '@/components/ui/button';
import {useParams, useRouter} from "next/navigation";
import {Loader2, Trash2} from "lucide-react";
import {adminDeleteDomain} from "@/actions/admin/domain";
import {handleActionResult} from "@/lib/handleActionResult";

const AdminDeleteDomain = () => {

    const [pending, startTransition] = useTransition();
    const {domainId} = useParams<{ domainId: string }>();
    const router = useRouter();

    function onSubmit() {
        startTransition(async () => {
            const result = await adminDeleteDomain(domainId);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Domaine supprimé !");
                    router.push("/admin/domains");
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
                    <CardTitle>Are you sure you want to delete this domain ?</CardTitle>
                    <CardDescription >
                        This action is irreversible. this will delete all the domain data.
                    </CardDescription>
                </CardHeader>
                <CardContent className={"flex items-center justify-between gap-4"}>
                    <Link href={"/admin/domains"} className={buttonVariants({variant: "outline"})}>
                        Cancel
                    </Link>
                    <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
                        {pending ? <> <Loader2 className={"size-4 animate-spin"}/> Deleting ... </> :
                            <> <Trash2 className={"size-4"}/>Delete Domain</>}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDeleteDomain;
