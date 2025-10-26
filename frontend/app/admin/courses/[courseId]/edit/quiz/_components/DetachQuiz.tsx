"use client";

import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {Loader2, UnlinkIcon} from "lucide-react";
import React from 'react';
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {detachQuizFromChapter, detachQuizFromCourse} from "@/actions/admin/quiz";


export function DetachQuiz({quizId, courseId, chapterId}: { quizId:string, courseId:string, chapterId?:string}) {

    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition();

    async function onSubmit(){
        startTransition(async () => {
            let result, error;

            if (chapterId) {
                ({ data: result, error } = await tryCatch(
                    detachQuizFromChapter(quizId, courseId, chapterId)
                ));
            } else {
                ({ data: result, error } = await tryCatch(
                    detachQuizFromCourse(quizId, courseId)
                ));
            }
            if(error){
                toast.error(error.message,{
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
                return;
            }
            if(result?.status === "success"){
                toast.success(result?.message,  {
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });
                setIsOpen(false);
            }else{
                toast.error(result?.message,{
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
        })
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={"ghost"} >
                    <UnlinkIcon className={"size-4"}/> Detach Quiz from Course
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. this will permanently detach the quiz from the course.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
                        {pending ? <> <Loader2 className={"size-4"}/> Detaching ...</> : <>Detach</>}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

