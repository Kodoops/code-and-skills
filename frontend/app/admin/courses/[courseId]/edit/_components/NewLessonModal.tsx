import React, {useState, useTransition} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Loader2, PlusIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {lessonSchema, LessonSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {adminCreateLesson} from "@/actions/admin/lesson";
import {handleActionResult} from "@/lib/handleActionResult";
import {useRouter} from "next/navigation";

export function NewLessonModal({courseId, chapterId}: { courseId: string , chapterId: string}) {

    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<LessonSchema>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: "",
            courseId: courseId,
            chapterId: chapterId,
        },
    })

    function handleOpenChange(open: boolean) {
        if (!open) {
            form.reset();
        }
        setIsOpen(open)
    }

    async function onSubmit(values: LessonSchema) {

        startTransition(async () => {
            const result = await adminCreateLesson(values);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Lesson créée !");
                    handleOpenChange(false)
                    router.push("/admin/courses/"+courseId+"/edit");
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"}  className={"w-full justify-center gap-2"}>
                    <PlusIcon className={"size-4"}/> New Lesson
                </Button>
            </DialogTrigger>
            <DialogContent title={"sm:maw-x-[425px"}>
                <DialogHeader>
                    <DialogTitle>
                        Create new Lesson
                    </DialogTitle>
                    <DialogDescription>
                        What would you like to name this lesson?
                    </DialogDescription>
                </DialogHeader>
                <Form {...form} >
                    <form className={"space-y-8"} onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name={"title"} render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Lesson Name"} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                        <DialogFooter >
                            <Button type={"submit"} disabled={pending}>
                                {pending ? <>
                                    <Loader2 className={"size-4 animate-spin"}/> Saving ...
                                </> : <>
                                    Save changes
                                </>}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

