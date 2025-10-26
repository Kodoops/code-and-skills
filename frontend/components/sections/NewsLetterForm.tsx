"use client";

import React from 'react';
import {theme} from "@/lib/theme";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useTransition} from "react";
import {type Resolver, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import {toast} from "sonner";
import { newsletterSchema, NewsletterSchema} from "@/lib/db/zodSchemas";
import {tryCatch} from "@/hooks/try-catch";
import {subscribeToNewsletter} from "@/actions/newsletter";

export default function NewsLetterForm() {
    const [isPending, startTransition] = useTransition();

    const form = useForm<NewsletterSchema>({
        resolver: zodResolver(newsletterSchema) as Resolver<NewsletterSchema>,
        defaultValues: {email: "", name:"", confirmed: false},
    });

    function onSubmit(values: NewsletterSchema) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(subscribeToNewsletter(values));

            if (error) {
                toast.error(error.message,{
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
            if (result?.status === "success") {
                toast.success(result?.message,  {
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });
                form.reset();
            } else {
                toast.error(result?.message,{
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-md gap-2 mx-auto">
                <FormField
                    control={form.control}
                    name="email"

                    render={({field}) => (
                        <FormItem className="flex-1">
                            <FormLabel className="sr-only">Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Votre email ... " {...field}
                                       className="h-12 rounded-lg placeholder:text-muted-foreground/30"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}
                        className="rounded-lg p-6 text-sm font-semibold text-white shadow transition hover:opacity-95"
                        style={{backgroundImage: theme.gradients.blue}}
                >
                    {isPending ? "..." : "S’abonner"}
                </Button>
            </form>
        </Form>
    );
};

