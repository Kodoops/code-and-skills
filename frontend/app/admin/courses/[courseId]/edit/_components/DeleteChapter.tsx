import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {Loader2, Trash2Icon} from "lucide-react";
import React from 'react';
import {handleActionResult} from "@/lib/handleActionResult";
import {useRouter} from "next/navigation";
import {adminDeleteChapter} from "@/actions/admin/chapter";


export function DeleteChapter({chapterId, courseId}: { chapterId:string, courseId:string}) {

    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    async function onSubmit(){
        startTransition(async () => {
            const result = await adminDeleteChapter(chapterId, courseId);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Chapitre supprimé !");
                    setIsOpen(false)
                    router.push("/admin/courses/"+courseId+"/edit");
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        })
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <Trash2Icon className={"size-4"}/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. this will permanently delete the chapter and all its lessons.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
                        {pending ? <> <Loader2 className={"size-4"}/> Deleting ...</> : <>Delete</>}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

