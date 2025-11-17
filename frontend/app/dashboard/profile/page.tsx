"use client";

import React, { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UserRound } from "lucide-react";

import {
    updateProfileSchema,
    type UpdateProfileSchema,
} from "@/lib/db/zodSchemas";
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
import { Textarea } from "@/components/ui/textarea";
import {Card, CardContent,CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {getUserProfileAction, updateProfileAction} from "@/actions/auth/user";
import Uploader from "@/components/file-uploader/Uploader";

export default function ProfilePage() {
    const [isPending, startTransition] = useTransition();

    const form = useForm<UpdateProfileSchema>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            email:"",
            title:"",
            firstname: "",
            lastname: "",
            bio: "",
            country: "",
            city: "",
            avatarUrl: "",
        },
    });

    // 🔹 Charger le profil au montage
    useEffect(() => {
        const loadProfile = async () => {
            const res = await getUserProfileAction();
            if (res.status==="success" && res.data) {
                form.reset(res.data);
            } else {
                toast.error(res.message || "Impossible de charger le profil.");
            }
        };
        loadProfile();
    }, [form]);

    const onSubmit = (values: UpdateProfileSchema) => {
        startTransition(async () => {
            const res = await updateProfileAction(values);
            if (res.status==="success" ) {
                toast.success(res.message, {
                    style: { background: "#D1FAE5", color: "#065F46" },
                });
            } else {
                toast.error(res.message, {
                    style: { background: "#FEE2E2", color: "#991B1B" },
                });
            }
        });
    };

    return (
        <Card>
            <CardHeader className={"text-center mb-6"}>
                <CardTitle>Mon profil </CardTitle>
                <CardDescription>
                   Informations de base sur mon profil.
                </CardDescription>
            </CardHeader>
            <CardContent className={"flex flex-col gap-4"}>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prénom</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ""} placeholder="John" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ""} placeholder="Doe" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email <span className={"text-sm italic text-primary"}>(non modifiable)</span> </FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value ?? ""} placeholder="Ex: email@email.com" disabled={true} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre ou Fonction</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value ?? ""} placeholder="Ex: Developpeur Fullstack" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        value={field.value ?? ""}
                                        rows={3}
                                        placeholder="Décrivez-vous en quelques lignes..."
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pays</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ""} placeholder="France" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ville</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ""} placeholder="Paris" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="avatarUrl"
                        render={({field}) => (
                            <FormItem className={"w-full"}>
                                <FormLabel>Avatar</FormLabel>
                                <FormControl>

                                    <Uploader
                                        value={field.value as string}
                                        onChange={field.onChange}
                                        fileTypeAccepted="image"
                                        folder="public/avatars"
                                        fileType="AVATAR"
                                    />
                                </FormControl>
                                <FormMessage/>
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
                            "Mettre à jour le profil"
                        )}
                    </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
    );
}