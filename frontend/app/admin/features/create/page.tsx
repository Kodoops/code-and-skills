"use client"

import {ArrowLeft, Loader2, PlusIcon} from 'lucide-react';
import Link from 'next/link';
import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button, buttonVariants} from "@/components/ui/button";
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
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useRouter} from "next/navigation";
import {featureSchema, FeatureSchema } from '@/lib/db/zodSchemas';
import {iconLibs, listColors} from "@/lib/types";
import {handleActionResult} from "@/lib/handleActionResult";
import {adminCreateFeature} from "@/actions/admin/feature";

const CreateFeaturePage = () => {
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<FeatureSchema>({
        resolver: zodResolver(featureSchema) as Resolver<FeatureSchema>,
        defaultValues: {
            title: "",
            desc: "",
            color:"",
            iconName:"",
            iconLib: "",
        },
    })

    function onSubmit(values: FeatureSchema) {
        startTransition(async () => {
            const result = await adminCreateFeature(values);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Feature créée !");
                    router.push("/admin/features");
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
                <Link href={"/admin/features"} className={buttonVariants({variant: "outline", size: "icon"})}>
                    <ArrowLeft className={"size-4"}/>
                </Link>
                <h1 className={"text-2xl font-bol"}>Create Feature</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Basic Information
                    </CardTitle>
                    <CardDescription>
                        Provide basic information about feature
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
                            <FormField
                                control={form.control}
                                name="desc"
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
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Color</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select color" />
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
                                            <FormMessage />
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
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Icon library name</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select icon library name" />
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type={"submit"} disabled={pending}>
                                {pending ? (<>
                                    Creating Feature ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                                </> ) :(<>
                                    Create Feature <PlusIcon className={"size-4 ml-1"}/>
                                </>)}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
};

export default CreateFeaturePage;
