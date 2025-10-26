"use client"

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Loader2, LogInIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";
import {loginFormSchema, LoginFormSchema} from '@/lib/db/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {Resolver, useForm} from 'react-hook-form';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {loginAction} from "@/actions/auth/auth";
import Link from "next/link";
import { handleActionResult } from '@/lib/handleActionResult';

const LoginForm = () => {

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema) as Resolver<LoginFormSchema>,
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginFormSchema) {

        startTransition(async () => {
            const result = await loginAction(values);

            handleActionResult(result, {
                onSuccess: () => {
                    router.push("/dashboard");
                },
                onError: (message) => {
                    console.warn("Erreur de connexion ⚠️", message);
                },
            });
        });
    }

    return (
        <Card>
            <CardHeader className={"text-center mb-6"}>
                <CardTitle>Bienvenue ! </CardTitle>
                <CardDescription>
                    Connectez-vous à votre compte
                </CardDescription>
            </CardHeader>
            <CardContent className={"flex flex-col gap-4"}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        noValidate
                    >
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="you@example.com"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="••••••••"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Submit */}
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <LogInIcon className="mr-2 h-4 w-4"/>
                                    Se connecter
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className={"flex justify-between"}  >
                <Link href={"/forgot-password"} className={"text-xs italic text-muted-foreground hover:text-primary"}>
                    Mot de passe oublié ?
                </Link>
                <Link href={"/register"} className={"text-xs italic text-muted-foreground hover:text-primary"}>
                   Je n'ai pas de compte
                </Link>
            </CardFooter>
        </Card>
    );
};

export default LoginForm;
