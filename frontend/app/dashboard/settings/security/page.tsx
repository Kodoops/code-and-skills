"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    changePasswordSchema,
    type ChangePasswordSchema,
} from "@/lib/db/zodSchemas";
import {changePasswordAction} from "@/actions/auth/password";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function ChangePasswordForm() {
    const [isPending, startTransition] = useTransition();

    const form = useForm<ChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: ChangePasswordSchema) => {
        startTransition(async () => {
            const result = await changePasswordAction({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            });

            if (result.status === "success") {
                toast.success(result.message, {
                    style: { background: "#D1FAE5", color: "#065F46" },
                });
                form.reset();

            } else {
                toast.error(result.message, {
                    style: { background: "#FEE2E2", color: "#991B1B" },
                });
            }
        });
    };

    return (
        <Card>
            <CardHeader className={"text-center mb-6"}>
                <CardTitle>Modifier Mot de passe</CardTitle>
                <CardDescription>
                   Procéder au changement de votre mot de passe.
                </CardDescription>
            </CardHeader>
            <CardContent className={"flex flex-col gap-4"}>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                >
                    <FormField
                        control={form.control}
                        name="oldPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ancien mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nouveau mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmer le mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mise à jour...
                            </>
                        ) : (
                            "Changer le mot de passe"
                        )}
                    </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
    );
}