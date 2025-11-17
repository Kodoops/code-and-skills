"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button, buttonVariants} from "@/components/ui/button";
import {ArrowLeft, Loader2, PlusIcon, SparkleIcon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useRouter} from "next/navigation";
import {type Resolver, useForm} from "react-hook-form";
import {pageLinkSchema, PageLinkSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import { tryCatch } from '@/hooks/try-catch';
import { toast } from 'sonner';
import Link from "next/link";
import {cn} from "@/lib/utils";
import slugify from "slugify";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import {pageLinksTypes} from "@/lib/db/types";
import {createPageLink} from "@/app/admin/settings/pages/create/actions";

const CreateAdminLinkPage = () => {

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<PageLinkSchema>({
        resolver: zodResolver(pageLinkSchema) as Resolver<PageLinkSchema>,
        defaultValues: {
            title: "",
            slug: "",
            content: "",
            type: "",
        },
    })

    function onSubmit(values: PageLinkSchema) {
        startTransition(async () => {
            const {data:result , error} = await tryCatch(createPageLink(values));

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
                router.push("/admin/settings/pages");
            }else{
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
        <Card>
            <CardHeader>
                <CardTitle>
                    Create Page
                </CardTitle>
                <CardDescription>
                    Provide basic information about page.
                </CardDescription>
                <Link href={"/admin/settings/pages"} className={cn(buttonVariants({variant: "default"}), "w-48")}>
                    <ArrowLeft className={"size-4"}/> Back to pages
                </Link>
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
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="title ... ex  a propos de nous" {...field} />
                                    </FormControl>
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
                            name="content"
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
                        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Icon library name</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select page link type"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {pageLinksTypes.map((item) => (
                                                    <SelectItem key={item} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>


                        <Button type={"submit"} disabled={pending}>
                            {pending ? (<>
                                Creating Page ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                            </>) : (<>
                                <PlusIcon className={"size-4 ml-1"}/> Create Page
                            </>)}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default CreateAdminLinkPage;
