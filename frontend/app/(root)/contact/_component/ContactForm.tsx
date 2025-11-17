"use client";

import React, {useEffect, useTransition} from 'react';
import {Resolver, useForm} from "react-hook-form";
import {contactMessageSchema, ContactMessageSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';

import {Loader2, SendIcon} from "lucide-react";
import {useSession} from '@/hooks/useSession';
import {handleActionResult} from "@/lib/handleActionResult";
import {createContactMessage} from "@/actions/public/contact";
import {useRouter} from "next/navigation";

const ContactForm = ({onSuccess}: { onSuccess?: () => void }) => {
    const {user, authenticated} = useSession();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<ContactMessageSchema>({
        resolver: zodResolver(contactMessageSchema) as Resolver<ContactMessageSchema>,
        defaultValues: {
            email: user?.email ?? "",
            name: user?.firstname && user?.lastname ? user?.firstname + " " + user?.lastname : "",
            subject: "",
            message: "",
            userId: user?.id ?? "",
        },
    });

    function onSubmit(values: ContactMessageSchema) {
        startTransition(async () => {
            const result = await createContactMessage(values);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Message envoyé !");
                    form.reset();
                    onSuccess?.(); // 👈 ferme le dialog
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });

        })
    }

    useEffect(() => {
        if (user) {
            form.reset({
                email: user.email ?? "",
                name: user?.firstname && user?.lastname ? user?.firstname + " " + user?.lastname : "",
                subject: "",
                message: "",
                userId: user.id ?? "",
            });
        }
    }, [user, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full  max-w-2xl gap-2 mx-auto space-y-6">
                <FormField
                    control={form.control}
                    name="name"

                    render={({field}) => (
                        <FormItem className="flex-1 w-full max-w-md ">
                            <FormLabel className="">Nom </FormLabel>
                            <FormControl>
                                <Input placeholder="ex : Jhon Doe " {...field}
                                       className="h-12 rounded-lg placeholder:text-muted-foreground/30"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"

                    render={({field}) => (
                        <FormItem className="flex-1 w-full max-w-md ">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="ex contact@email.com... " {...field}
                                       className="h-12 rounded-lg placeholder:text-muted-foreground/30"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="subject"
                    render={({field}) => (
                        <FormItem className="w-full ">
                            <FormLabel>Sujet : </FormLabel>
                            <FormControl>
                                <Input placeholder="ex Demande de devis sur ... " {...field}
                                       className="h-12 rounded-lg placeholder:text-muted-foreground/30"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>Votre méssage</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Votre méssage"
                                          className={"min-h-[120px]"}
                                          {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type={"submit"} disabled={isPending}>
                    {isPending ? (<>
                        Sending Message ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                    </>) : (<>
                        Send Message <SendIcon className={"size-4 ml-1"}/>
                    </>)}
                </Button>
            </form>

        </Form>
    );
};

export default ContactForm;
