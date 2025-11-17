"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button, buttonVariants} from '@/components/ui/button';
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {useParams, useRouter} from "next/navigation";
import {Loader2, Trash2} from "lucide-react";
import {adminDeleteCategory} from "@/actions/admin/categories";
import {handleActionResult} from "@/lib/handleActionResult";

const AdminDeleteCategoryPage = () => {

    const [pending, startTransition] = useTransition();
    const {categoryId} = useParams<{ categoryId: string }>();
    const router = useRouter();

    function onSubmit() {
        startTransition(async () => {
            const result = await adminDeleteCategory(categoryId);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Catégorie supprimée !");
                    router.push("/admin/categories");
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
                    <CardTitle>Are you sure you want to delete this category ?</CardTitle>
                    <CardDescription >
                        This action is irreversible. this will delete all the category data.
                    </CardDescription>
                </CardHeader>
                <CardContent className={"flex items-center justify-between gap-4"}>
                    <Link href={"/admin/categories"} className={buttonVariants({variant: "outline"})}>
                        Cancel
                    </Link>
                    <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
                        {pending ? <> <Loader2 className={"size-4 animate-spin"}/> Deleting ... </> :
                            <> <Trash2 className={"size-4"}/>Delete Category</>}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDeleteCategoryPage;
