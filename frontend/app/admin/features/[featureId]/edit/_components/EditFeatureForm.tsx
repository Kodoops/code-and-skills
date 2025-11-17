"use client"

import React, {useTransition} from 'react';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Loader2, PlusIcon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    featureSchema,
    FeatureSchema
} from "@/lib/db/zodSchemas";
import {type Resolver, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {notFound, useRouter} from "next/navigation";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Feature } from '@/models';
import {handleActionResult} from "@/lib/handleActionResult";
import {adminUpdateFeature} from "@/actions/admin/feature";
import {iconLibs, listColors} from "@/lib/types";

interface EditFeatureFormProps {
    data   :Feature
}

const EditFeatureForm = ({data}:EditFeatureFormProps) => {
    if (!data) notFound();

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<FeatureSchema>({
        resolver: zodResolver(featureSchema) as Resolver<FeatureSchema>,
        defaultValues: {
            title: data.title,
            desc: data.desc,
            iconLib: data?.iconLib || undefined,
            iconName: data?.iconName || undefined,
            color: data?.color || undefined
        },
    })

    function onSubmit(values: FeatureSchema) {
        startTransition(async () => {
            const result = await adminUpdateFeature(values, data!.id);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Feature updated !");
                    router.push("/admin/features");
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                    toast.error(message);
                },
            })
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
                <Button type={"submit"} disabled={pending}>
                    {pending ? (<>
                        Updating Feature ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                    </>) : (<>
                        Update Feature <PlusIcon className={"size-4 ml-1"}/>
                    </>)}
                </Button>
            </form>
        </Form>
    );
};

export default EditFeatureForm;
