"use client";

import React, {useTransition} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {forgotPasswordSchema, ForgotPasswordSchema} from "@/lib/db/zodSchemas";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import {Loader2} from "lucide-react";
import {forgotPasswordAction} from "@/actions/auth/password";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition();

    const form = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {email: ""},
    });

    const onSubmit = (values: ForgotPasswordSchema) => {
        startTransition(async () => {
            const result = await forgotPasswordAction(values.email);

            if (result.success) {
                toast.success(result.message, {
                    style: {background: "#D1FAE5", color: "#065F46"},
                });
            } else {
                toast.error(result.message, {
                    style: {background: "#FEE2E2", color: "#991B1B"},
                });
            }
        });
    };

    return (
        <Card>
            <CardHeader className={"text-center mb-6"}>
                <CardTitle> Mot de passe oublié? </CardTitle>
                <CardDescription>
                    Réinitialiser votre mot de passe
                </CardDescription>
            </CardHeader>
            <CardContent className={"flex flex-col gap-4"}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Adresse e-mail</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="you@example.com" {...field}
                                               disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Envoi en cours...
                                </>
                            ) : (
                                "Envoyer le lien"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}