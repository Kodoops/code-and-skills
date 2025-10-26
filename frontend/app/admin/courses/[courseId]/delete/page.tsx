"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button, buttonVariants} from '@/components/ui/button';
import {useParams, useRouter} from "next/navigation";
import {Loader2, Trash2} from "lucide-react";
import {adminDeleteCourse} from "@/actions/admin/course";
import {handleActionResult} from "@/lib/handleActionResult";

const AdminDeleteCourse = () => {

    const [pending, startTransition] = useTransition();
    const {courseId} = useParams<{ courseId: string }>();
    const router = useRouter();

    function onSubmit() {
        startTransition(async () => {
            const result = await adminDeleteCourse(courseId);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Cours supprimé !");
                    router.push("/admin/courses");
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
                    <CardTitle>Are you sure you want to delete this course ?</CardTitle>
                    <CardDescription >
                        This action is irreversible. this will delete all the course data.
                    </CardDescription>
                </CardHeader>
                <CardContent className={"flex items-center justify-between gap-4"}>
                    <Link href={"/admin/courses"} className={buttonVariants({variant: "outline"})}>
                        Cancel
                    </Link>
                    <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
                        {pending ? <> <Loader2 className={"size-4 animate-spin"}/> Deleting ... </> :
                            <> <Trash2 className={"size-4"}/>Delete Course</>}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDeleteCourse;
