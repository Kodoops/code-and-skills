"use client"

import {Loader2, PlusIcon} from 'lucide-react';
import React, {useTransition} from 'react';
import {Button} from "@/components/ui/button";
import {companySchema, CompanySchema} from "@/lib/db/zodSchemas";
import {zodResolver} from '@hookform/resolvers/zod';
import type {Resolver} from "react-hook-form";
import {useForm} from "react-hook-form"
import {Input} from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {useRouter} from "next/navigation";
import { Company } from '@/models';
import {handleActionResult} from "@/lib/handleActionResult";
import {updateCompanyInfos} from "@/actions/admin/company";


const CompanyInfoForm = ({data}: { data: Company  }) => {
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CompanySchema>({
        resolver: zodResolver(companySchema) as Resolver<CompanySchema>,
        defaultValues: {
            name: data.name,
            address: data.address,
            city: data.city,
            country: data.country,
            postalCode: data.postalCode,
            email: data.email,
            vatNumber: data.vatNumber || undefined,
            siret: data.siret || undefined,
            phone: data.phone || undefined,
            logoUrl: data.logoUrl || undefined,
        },
    })

    function onSubmit(values: CompanySchema) {
        startTransition(async () => {
            const result = await updateCompanyInfos(values);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Companie mise à  jour !");
                    router.push("/admin/company-infos");
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        })
    }

    return (
        <>

            <Form {...form} >
                <form className={"space-y-6"}
                      onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
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
                        name="address"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Address" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Postal code" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Country" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="phone" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="vatNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>V.A.T Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="vat number" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="siret"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>SIRET</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Siret" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="logoUrl"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Logo URL </FormLabel>
                                <FormControl>
                                    <Input placeholder="Logo url" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button type={"submit"} disabled={pending}>
                        {pending ? (<>
                            Updating Company Infos ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                        </>) : (<>
                            Update Company Infos <PlusIcon className={"size-4 ml-1"}/>
                        </>)}
                    </Button>
                </form>
            </Form>

        </>
    );
};

export default CompanyInfoForm;
