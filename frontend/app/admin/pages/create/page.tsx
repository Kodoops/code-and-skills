"use client"

import {ArrowLeft, Loader2, PlusIcon, SparkleIcon} from 'lucide-react';
import Link from 'next/link';
import React, { useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button, buttonVariants} from "@/components/ui/button";
import { pageLinkSchema, PageLinkSchema} from "@/lib/db/zodSchemas";
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from "react-hook-form";
import {useForm} from "react-hook-form"
import {Input} from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import slugify from "slugify";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import {useRouter} from "next/navigation";
import {useSession} from "@/hooks/useSession";
import {handleActionResult} from "@/lib/handleActionResult";
import {createPage} from "@/actions/admin/page";
import {PAGE_TYPES} from "@/models";


const CreatePagePage =  ( ) => {
    const {user, loading} = useSession();
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

    if (loading) return <p>Chargement...</p>;
    if (!user) return <p>Redirection...</p>;

    function onSubmit(values: PageLinkSchema) {
        startTransition(async () => {

            const result = await createPage(values);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Page créé !");
                    router.push("/admin/pages");
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        })
    }

    return (
        <>
            <div className="flex items-center gap-4">
                <Link href={"/admin/pages"} className={buttonVariants({variant: "outline", size: "icon"})}>
                    <ArrowLeft className={"size-4"}/>
                </Link>
                <h1 className={"text-2xl font-bol"}>Create Page</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Basic Information
                    </CardTitle>
                    <CardDescription>
                        Provide basic information about page
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
                                        <FormLabel>Contenu</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Type de page (ex: footer : Lien de page dans footer)</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select type"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        PAGE_TYPES.map((type) =>(
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                            </SelectItem>))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type={"submit"} disabled={pending}>
                                {pending ? (<>
                                    Creating page ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                                </>) : (<>
                                    Create page <PlusIcon className={"size-4 ml-1"}/>
                                </>)}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
};

export default CreatePagePage;
