"use client";

import React, {useTransition} from 'react';
import Link from 'next/link';
import {ArrowLeft, Loader2} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useForm} from "react-hook-form";
import { lessonSchema, LessonSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from "@/components/ui/input";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import { Checkbox } from '@/components/ui/checkbox';
import {Lesson} from "@/models";
import {adminUpdateLesson} from "@/actions/admin/lesson";
import {handleActionResult} from "@/lib/handleActionResult";

interface Props {
    data: Lesson;
    chapterId: string;
    courseId: string;
}

export function LessonForm({data, chapterId, courseId}: Props) {

    const [pending, startTransition] = useTransition();

    const form = useForm<LessonSchema>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: data.title,
            chapterId: chapterId,
            courseId: courseId,
            description: data.description ?? undefined,
            videoKey: data.videoKey ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined,
            publicAccess:data.publicAccess ?? false,
        },
    })

    async function onSubmit(values: LessonSchema) {
        startTransition(async () => {
            const result = await adminUpdateLesson(data.id, values )

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Lesson mise à jour !");
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        });
    }

    return (
        <div className={""}>
            <Link href={`/admin/courses/${courseId}/edit`}
                  className={buttonVariants({variant: "outline", className: "mb-6"})}>
                <ArrowLeft className={"size-4"}/> Go Back
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Lesson Configuration</CardTitle>
                    <CardDescription>
                        Configure the video and other details of the lesson.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form  {...form}>
                        <form className={"space-y-6"} onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name={"title"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder={"Lesson title"} {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={"description"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"thumbnailKey"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail Image </FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted={'image'} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"videoKey"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Video File</FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted={'video'} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="publicAccess"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="!mt-0">Public ?</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type={"submit"} disabled={pending}>
                                {pending ? <>
                                <Loader2 className={"size-4 animate-spin"}/> Saving ...
                                </> : <>Save Lesson</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

