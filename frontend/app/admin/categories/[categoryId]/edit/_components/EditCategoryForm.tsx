"use client"

import React, {useTransition} from 'react';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Loader2, PlusIcon, SparkleIcon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    categorySchema,
    CategorySchema,
} from "@/lib/db/zodSchemas";
import {type Resolver, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {notFound, useRouter} from "next/navigation";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import slugify from 'slugify';
import {Category, Domain, iconLibs, listColors} from '@/models';
import {adminUpdateCategory} from "@/actions/admin/categories";

interface EditCategoryFormProps {
    data   :Category,
    domains:Domain[]
}

const EditCategoryForm = ({data, domains}:EditCategoryFormProps) => {
    if (!data) notFound();

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CategorySchema>({
        resolver: zodResolver(categorySchema) as Resolver<CategorySchema>,
        defaultValues: {
            title: data.title,
            description: data.description ?? '',
            slug: data.slug,
            iconLib: data?.iconLib || undefined,
            iconName: data?.iconName || undefined,
            color: data?.color || undefined,
            domainId: data?.domainId,
            domainTitle: data?.domainTitle,
            domainSlug: data?.domainSlug
        },
    })

    function onSubmit(values: CategorySchema) {
        startTransition(async () => {
            const {data:result , error} = await tryCatch(adminUpdateCategory( data!.id, values));

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
                router.push("/admin/categories");
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
                    name="description"
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

                <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="color"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>Color</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select color"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {listColors.map((color) => (
                                            <SelectItem key={color} value={color}>
                                                {color}
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
                        name="iconName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Icon Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name of icon" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="iconLib"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>Icon library name</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select icon library name"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {iconLibs.map((lib) => (
                                            <SelectItem key={lib} value={lib}>
                                                {lib}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="domainId"
                    render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Domain</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Domain for Category"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {domains.map((domain) => (
                                        <SelectItem key={domain.id} value={domain.id}>
                                            {domain.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type={"submit"} disabled={pending}>
                    {pending ? (<>
                        Updating Category ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                    </>) : (<>
                        Update Category <PlusIcon className={"size-4 ml-1"}/>
                    </>)}
                </Button>
            </form>
        </Form>
    );
};

export default EditCategoryForm;
