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
import {adminDeleteLesson} from "@/actions/admin/lesson";
import {handleActionResult} from "@/lib/handleActionResult";
import {useRouter} from "next/navigation";


export function DeleteLesson({chapterId, courseId, lessonId}: { chapterId:string, courseId:string, lessonId: string}) {

    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    async function onSubmit(){
        startTransition(async () => {
            const result = await adminDeleteLesson( lessonId);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Lesson supprimée !");
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
                        This action cannot be undone. this will permanently delete the lesson.
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

