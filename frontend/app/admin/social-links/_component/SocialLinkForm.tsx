"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Link, Loader2} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useRouter} from "next/navigation";
import {type Resolver, useForm} from "react-hook-form";
import {CompanySocialLinkSchema, companySocialLinkSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {addSocialLink} from "@/actions/admin/social-networks";
import {SocialLink} from "@/models";
import {handleActionResult} from "@/lib/handleActionResult";

const SocialLinkForm = ({links}:{links: SocialLink []}) => {

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CompanySocialLinkSchema>({
        resolver: zodResolver(companySocialLinkSchema) as Resolver<CompanySocialLinkSchema>,
        defaultValues: {
            url: "",
            socialLinkId:"",
        },
    })

    function onSubmit(values: CompanySocialLinkSchema) {
        startTransition(async () => {
            const result = await addSocialLink(values);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Social Link ajouté !");
                    form.reset();
                    router.push("/admin/social-links");
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Existing Social Links
                </CardTitle>
                <CardDescription>
                    Select social account to add to your website.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form} >
                    <form className={"space-y-6"}
                          onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="socialLinkId"
                                render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Social </FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select social account" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {links.map((link) => (
                                                    <SelectItem key={link.id} value={link.id}>
                                                        {link.name}
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
                                name="url"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Url</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Url to social account" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>


                        <Button type={"submit"} disabled={pending}>
                            {pending ? (<>
                                Adding  Account ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                            </> ) :(<>
                                <Link className={"size-4 ml-1"}/>  Attach Social Account
                            </>)}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default SocialLinkForm;
