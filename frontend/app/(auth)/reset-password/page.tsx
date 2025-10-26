"use client";

import React, {useTransition} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {resetPasswordSchema, ResetPasswordSchema} from "@/lib/db/zodSchemas";
import {toast} from "sonner";
import {useSearchParams, useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import {Loader2} from "lucide-react";
import {resetPasswordAction} from "@/actions/auth/password";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function ResetPasswordPage() {
    const params = useSearchParams();
    const router = useRouter();
    const token = params.get("token");

    const [isPending, startTransition] = useTransition();

    const form = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: ResetPasswordSchema) => {
        if (!token) {
            toast.error("Lien de réinitialisation invalide.");
            return;
        }

        startTransition(async () => {
            const result = await resetPasswordAction(token, values.password);

            if (result.success) {
                toast.success(result.message, {
                    style: {background: "#D1FAE5", color: "#065F46"},
                });
                router.push("/login");
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
                <CardTitle> Réinitialiser le mot de passe </CardTitle>
                <CardDescription>
                  Votre nouveau mot de passe
                </CardDescription>
            </CardHeader>
            <CardContent className={"flex flex-col gap-4"}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Nouveau mot de passe</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Confirmer le mot de passe</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Réinitialisation...
                                </>
                            ) : (
                                "Réinitialiser"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}