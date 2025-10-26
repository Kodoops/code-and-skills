"use client";

import React, {useTransition} from 'react';
import {useRouter} from "next/navigation";
import {attachQuizFormToCourse, AttachQuizFormToCourse} from "@/lib/db/zodSchemas";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import Pagination from "@/components/general/Pagination";
import {QuizType} from '@/lib/db/types.ts';
import {type Resolver, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {attachQuiz} from "@/app/admin/courses/[courseId]/edit/quiz/add/action";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import AddQuizCard from "@/app/admin/courses/[courseId]/edit/quiz/_components/AddQuizCard";
import {Card} from "@/components/ui/card";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Button, buttonVariants} from "@/components/ui/button";
import {ArrowLeftIcon, Loader2, PlusIcon} from "lucide-react";
import Link from "next/link";
import {cn} from "@/lib/utils";

interface Props {
    courseId: string|undefined;
    chapterId: string|undefined;
    data: QuizType[] | null;
    currentPage: number;
    totalPages: number;
    quizId: string | undefined;
}

const AttachQuizForm = ({data, courseId, chapterId, totalPages, currentPage, quizId}: Props) => {

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<AttachQuizFormToCourse>({
        resolver: zodResolver(attachQuizFormToCourse) as Resolver<AttachQuizFormToCourse>,
        defaultValues: {
            courseId: courseId,
            chapterId: chapterId,
            quizId: quizId,
        },
    })

    function onSubmit(values: AttachQuizFormToCourse) {
        startTransition(async () => {

            const {data: result, error} = await tryCatch(attachQuiz(values));

            if (error) {
                toast.error(error.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
            if (result?.status === "success") {
                toast.success(result?.message, {
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });
                form.reset();
                router.push("/admin/courses/" + courseId + "/edit");
            } else {
                toast.error(result?.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
        })
    }


    return (
        <Form {...form} >
            <form className={"space-y-6 w-full "}
                  onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex items-center gap-4 justify-between  ">
                    <Link href={"/admin/courses/" + courseId + "/edit"}
                          className={cn(buttonVariants({variant: "outline"}))}>
                        <ArrowLeftIcon className={"size-4"}/> Go back
                    </Link>
                    <Button type={"submit"} disabled={pending}>
                        {pending ? (<>
                            Updating Course ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                        </>) : (<>
                            Attach Selected Quiz to Course <PlusIcon className={"size-4 ml-1"}/>
                        </>)}
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 ">

                    {data?.map((quiz) => (
                        <Card key={quiz.id} className="px-4">
                            <FormField
                                control={form.control}
                                name="quizId"
                                render={({field}) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="flex flex-col space-y-2"
                                            >
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl>
                                                        <RadioGroupItem value={quiz.id}/>
                                                    </FormControl>
                                                    <AddQuizCard data={quiz} />
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </Card>
                    ))}

                </div>
                {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages}/>}
            </form>
        </Form>
    );
};

export default AttachQuizForm;
