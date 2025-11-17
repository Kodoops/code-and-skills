"use client";

import React from 'react';
import {theme} from "@/lib/theme";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useTransition} from "react";
import {type Resolver, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import { newsletterSchema, NewsletterSchema} from "@/lib/db/zodSchemas";
import {subscribeToNewsletter} from "@/actions/newsletter";
import {handleActionResult} from "@/lib/handleActionResult";
import {useRouter} from "next/navigation";

export default function NewsLetterForm() {
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const form = useForm<NewsletterSchema>({
        resolver: zodResolver(newsletterSchema) as Resolver<NewsletterSchema>,
        defaultValues: {email: "", name:"", confirmed: false},
    });

    function onSubmit(values: NewsletterSchema) {
        startTransition(async () => {
            const result = await subscribeToNewsletter(values);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Inscription a la newsletter confirmée !");
                    form.reset();
                    router.push("/");
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
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

