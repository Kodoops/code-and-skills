"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button, buttonVariants} from '@/components/ui/button';
import {useParams, useRouter} from "next/navigation";
import {Loader2, Trash2} from "lucide-react";
import {adminDeleteFeature} from "@/actions/admin/feature";
import {handleActionResult} from "@/lib/handleActionResult";

const AdminDeleteFeaturePage = () => {

    const [pending, startTransition] = useTransition();
    const {featureId} = useParams<{ featureId: string }>();
    const router = useRouter();

    function onSubmit() {
        startTransition(async () => {
            const result = await adminDeleteFeature(featureId);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Feature supprimée !");
                    router.push("/admin/features");
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
                    <CardTitle>Are you sure you want to delete this feature ?</CardTitle>
                    <CardDescription >
                        This action is irreversible. this will delete all the feature data.
                    </CardDescription>
                </CardHeader>
                <CardContent className={"flex items-center justify-between gap-4"}>
                    <Link href={"/admin/features"} className={buttonVariants({variant: "outline"})}>
                        Cancel
                    </Link>
                    <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
                        {pending ? <> <Loader2 className={"size-4 animate-spin"}/> Deleting ... </> :
                            <> <Trash2 className={"size-4"}/>Delete Feature</>}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDeleteFeaturePage;
