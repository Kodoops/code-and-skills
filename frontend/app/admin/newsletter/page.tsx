import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Pagination from '@/components/general/Pagination';
import {CheckIcon, Trash2, X} from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils';
import {buttonVariants} from "@/components/ui/button";
import {NEWSLETTER_PER_PAGE} from "@/constants/admin-contants";
import {getNewsletterList} from "@/actions/admin/newslatter";
import CardError from '@/components/custom-ui/CardError';


const NewsletterPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
        status?: boolean | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "0", 10);
    const status= params?.status ?? null ;

    const result = await getNewsletterList({page, size: NEWSLETTER_PER_PAGE, status});

    if(!result || result.status==="error"){
        return <CardError message={result.message} title={"Erreur chargement des newsletter"} />
    }

    const items = result.data?.content;
    console.log(items)
    return (
        <div className="w-full p-6">
            <div className="flex items-center justify-between mb-6 gap-2 border-b">
                <h1 className={"flex-1 text-2xl font-bold mb-4  w-full py-2"}>Newsletter : list of subscriber</h1>
                <div className="flex gap-3 items-center justify-end text-xs">
                    <Link href={"/admin/newsletter"} className={"border border-border bg-secondary p-2 rounded"}> All </Link>
                    <Link href={"/admin/newsletter?status=true"} className={"border border-border bg-primary p-2 rounded"}> Confirmed </Link>
                    <Link href={"/admin/newsletter?status=false"} className={"border border-border bg-destructive p-2 rounded"}> Pending </Link>
                </div>
            </div>
            <Table>
                <TableHeader className="bg-transparent">
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <tbody aria-hidden="true" className="table-row h-2"></tbody>
                <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
                    {items?.map((item) => (
                        <TableRow
                            key={item.id}
                            className="odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent"
                        >
                            <TableCell className="py-2.5 font-medium">{item.name}</TableCell>
                            <TableCell className="py-2.5">{item.email}</TableCell>
                            <TableCell className="py-2.5">{item.confirmed ?
                                <CheckIcon className={"size-4 text-green-500"}/> :
                                <X className={"size-4 text-destructive"}/>
                            }
                            </TableCell>
                            <TableCell className="py-2.5 text-right">
                                <Link href={`/admin/newsletter/${item.id}/delete`}
                                      className={cn(buttonVariants({variant:"outline", className: "cursor-pointer"}))}>
                                    <Trash2 className={"size-6 text-muted-foreground/40 "}/>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <tbody aria-hidden="true" className="table-row h-2"></tbody>
            </Table>
            {result?.data && result.data.totalPages > 1 && <Pagination totalPages={result.data.totalPages} page={page}/>}
        </div>
    );
};

export default NewsletterPage;
