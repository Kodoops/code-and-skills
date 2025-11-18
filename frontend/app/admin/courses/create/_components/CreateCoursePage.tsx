"use client"

import {ArrowLeft, Loader2, PlusIcon, SparkleIcon} from 'lucide-react';
import Link from 'next/link';
import React, {useEffect, useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button, buttonVariants} from "@/components/ui/button";
import {  courseSchema, CourseSchema} from "@/lib/db/zodSchemas";
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from "react-hook-form";
import {useForm} from "react-hook-form"
import {Input} from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import slugify from "slugify";
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import {useRouter} from "next/navigation";
import {useConfetti} from "@/hooks/use-confetti";
import {adminCreateCourse} from "@/actions/admin/course";
import {useSession} from "@/hooks/useSession";
import {handleActionResult} from "@/lib/handleActionResult";
import Uploader from "@/components/file-uploader/Uploader";
import { v4 as uuidv4 } from "uuid";

interface CreateCoursePageProps {
    categories: { id: string; slug: string; title: string }[];
    levels: string[];
    status: string[];
}

const CreateCoursePage =  ( { categories , levels, status}:CreateCoursePageProps) => {
    const {user, loading} = useSession();
    const [pending, startTransition] = useTransition();
    const router = useRouter();
    const {triggerConfetti} = useConfetti();

    const form = useForm<CourseSchema>({
        resolver: zodResolver(courseSchema) as Resolver<CourseSchema>,
        defaultValues: {
            id:uuidv4(),
            title: "",
            slug: "",
            smallDescription: "",
            description: "",
            price: 0,
            currency:"Eur",
            duration: 1,
            level: "Beginner" ,
            fileKey: "",
            categoryId: "",
            status: "DRAFT",
            userId: user?.userId
        },
    })


    useEffect(() => {
        if (user?.id) {
            form.setValue("userId", user?.userId);
        }
    }, [user?.userId, form]);

    if (loading) return <p>Chargement...</p>;
    if (!user) return <p>Redirection...</p>;


    function onSubmit(values: CourseSchema) {
        startTransition(async () => {

            const result = await adminCreateCourse(values);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Cours créé !");
                    triggerConfetti();
                    router.push("/admin/courses");
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        })
    }


    const uuid = uuidv4()
    let PUBLIC_COURSE_THUMBNAILS_FOLDER=`public/courses/${form.getValues().id}` ;

    return (
        <>
            <div className="flex items-center gap-4">
                <Link href={"/admin/courses"} className={buttonVariants({variant: "outline", size: "icon"})}>
                    <ArrowLeft className={"size-4"}/>
                </Link>
                <h1 className={"text-2xl font-bol"}>Create Courses</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Basic Information
                    </CardTitle>
                    <CardDescription>
                        Provide basic information about course
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                                            <RichTextEditor field={field}/>
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
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Category"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Level</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Level"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {levels.map((level) => (
                                                        <SelectItem key={level} value={level}>
                                                            {level}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
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

                            <Button type={"submit"} disabled={pending}>
                                {pending ? (<>
                                    Creating Course ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                                </>) : (<>
                                    Create Course <PlusIcon className={"size-4 ml-1"}/>
                                </>)}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
};

export default CreateCoursePage;
