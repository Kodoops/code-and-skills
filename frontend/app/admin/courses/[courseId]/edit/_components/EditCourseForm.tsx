"use client"

import React, {useEffect, useTransition} from 'react';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Loader2, PlusIcon, SparkleIcon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {  courseSchema, CourseSchema} from "@/lib/db/zodSchemas";
import {type Resolver, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {notFound, useRouter} from "next/navigation";
import Uploader from '@/components/file-uploader/Uploader';
import { Button } from '@/components/ui/button';
import RichTextEditor from "@/components/rich-text-editor/Editor";
import { Textarea } from '@/components/ui/textarea';
import slugify from 'slugify';
import {Category, Course, LEVELS, STATUS} from "@/models";
import {adminUpdateCourse} from "@/actions/admin/course";
import {useSession} from "@/hooks/useSession";
import {handleActionResult} from "@/lib/handleActionResult";

interface EditCourseFormProps {
    data   :Course;
    categories: Category[];
}

const EditCourseForm = ({data, categories}:EditCourseFormProps) => {
    if (!data) notFound();

    const {user, loading} = useSession();
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CourseSchema>({
        resolver: zodResolver(courseSchema) as Resolver<CourseSchema>,
        defaultValues: {
            title: data.title,
            description: data.description,
            fileKey: data.fileKey,
            price: data.price,
            duration: data.duration,
            currency:data.currency ?? "Eur",
            level: data.level,
            categoryId: data.categoryId,
            status: data.status,
            slug: data.slug,
            smallDescription: data.smallDescription,
            userId: user?.userId
        },
    })

    useEffect(() => {
        if (user?.id) {
            form.setValue("userId", user?.userId);
        }
    }, [user?.userId, form]);

    if (loading) return <p>Chargement...</p>;

    function onSubmit(values: CourseSchema) {
        startTransition(async () => {

            const result = await adminUpdateCourse(data!.id, values);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Cours mis à jour !");
                    router.push("/admin/courses");
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        })
    }


    let PUBLIC_COURSE_THUMBNAILS_FOLDER= `public/courses/${data.id}/`;
    return (
        <Form {...form} >
            <form className={"space-y-6"}
                  onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-end ">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({field}) => (
                            <FormItem className={"w-full"}>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="Slug" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type={"button"} className={"w-fit"}
                            onClick={() => {
                                const titleValue = form.getValues("title");
                                const slug = slugify(titleValue);
                                form.setValue('slug', slug, {shouldValidate: true});
                            }}>
                        Generate Slug <SparkleIcon className={"size-4 ml-1"}/>
                    </Button>
                </div>
                <FormField
                    control={form.control}
                    name="smallDescription"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>Small Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Small Description"
                                          className={"min-h-[120px]"}
                                          {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <RichTextEditor field={field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fileKey"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>Thumbnail Image</FormLabel>
                            <FormControl>
                                <Uploader
                                    value={field.value as string}
                                    onChange={field.onChange}
                                    fileTypeAccepted="image"
                                    folder={PUBLIC_COURSE_THUMBNAILS_FOLDER}
                                    fileType="THUMBNAIL"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Category</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id} >
                                                {category.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Level</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {LEVELS.map((level) => (
                                            <SelectItem key={level} value={level.toUpperCase()}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({field}) => (
                            <FormItem className={"w-full"}>
                                <FormLabel>Duration (hours) </FormLabel>
                                <FormControl>
                                    <Input placeholder="duration"
                                           type={"number"}
                                           {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({field}) => (
                            <FormItem className={"w-full"}>
                                <FormLabel>Price ($) </FormLabel>
                                <FormControl>
                                    <Input placeholder="price"
                                           type={"number"}
                                           {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Status</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {STATUS.map((status) => (
                                        <SelectItem key={status} value={status.toUpperCase()}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type={"submit"} disabled={pending}>
                    {pending ? (<>
                        Updating Course ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                    </> ) :(<>
                        Update Course <PlusIcon className={"size-4 ml-1"}/>
                    </>)}
                </Button>
            </form>
        </Form>
    );
};

export default EditCourseForm;
