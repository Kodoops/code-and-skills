"use client";

import React, {useState, useTransition} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button, buttonVariants} from "@/components/ui/button";
import {FileText, Loader2, Minus} from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {Skeleton} from "@/components/ui/skeleton";
import {Invoice} from "@/models";
import {useRouter} from "next/navigation";
import {downloadInvoice} from "@/actions/auth/invoice";

const InvoiceCard = ({invoice}: { invoice: Invoice }) => {
    const [pending, startTransition]= useTransition() ;
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    function onDownload(invoiceId: string) {
        startTransition(async () => {

            const res = await downloadInvoice(invoiceId);

            setLoading(false);

            if (!res.ok) {
                // Tu peux remplacer par un toast
                alert(res.message);
                return;
            }

            // 1) Décoder la base64 en bytes
            const byteCharacters = atob(res.base64);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            // 2) Créer un Blob PDF
            const blob = new Blob([byteArray], { type: "application/pdf" });

            // 3) Créer une URL temporaire et simuler un clic
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = res.fileName || "invoice.pdf";
            document.body.appendChild(a);
            a.click();

            // 4) Nettoyage
            a.remove();
            window.URL.revokeObjectURL(url);
        })
    }

    if (loading || pending) {
        return (
            <Card>
                <CardHeader className={"border-b border-border-foreground"}>
                    <CardTitle className={"text-center font-semibold"}>
                        Loading ...
                    </CardTitle>
                </CardHeader>
                <CardContent className={"space-y-4 mt-2 flex justify-center items-center gap-2"}>
                    <Loader2 className={"size-12 animate-spin"}/>
                   <p className={"text-center"}>Downloading invoice ...</p>
                </CardContent>
            </Card>
        )
    }
    return (
        <Card>
            <CardHeader className={"border-b border-border-foreground"}>
                <CardTitle className={"text-center font-semibold"}>
                    Invoice : {invoice.invoiceNumber}

                </CardTitle>
            </CardHeader>
            <CardContent className={"space-y-4 mt-2"}>
                <p className={"flex items-center justify-between"}>
                    <span>Total :</span>
                    <span className={"font-bold text-xl"}>{(invoice.amount/100).toFixed(2)}
                        <span className={"ml-1 text-xs uppercase"}>{invoice.currency}</span>
                    </span>
                </p>

                <Accordion type="multiple">
                    {invoice.items.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <p className={"flex items-center justify-between"}>
                                    <span>Content :</span>
                                    <span>{invoice.items.length} item(s)</span>
                                </p>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex items-center gap-2">
                                    <Minus className={"size-2"}/>
                                    <p>{item.title}</p>
                                </div>
                                <div
                                    className="ml-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm space-y-2 sm:space-y-0">
                                    <p>
                                        Type : <span className="text-xs">( {item.type } )</span>
                                    </p>
                                    <p>
                                        Qty : <span className="text-sm">({item.quantity})</span>
                                    </p>
                                    <p>
                                        Unit price : {(item.unitPrice/100).toFixed(2)}
                                        <span className="ml-1 text-xs uppercase"> {invoice.currency}</span>
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="flex  items-center justify-center gap-4 ">
                    <Button className={"cursor-pointer"} onClick={() => onDownload(invoice.id)}>
                    <FileText className={"size-4"}/> Donwload
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default InvoiceCard;


export function InvoiceItemCardSkeleton() {
    return <Card className={"group relative py-0 gap-0"}>

        <CardHeader className={"border-b border-border-foreground"}>
            <CardTitle className={"text-center font-semibold flex items-center justify-center"}>

                <Skeleton className={"h-6 w-4/5 rounded-full bg-muted-foreground/10 my-4"}/>

            </CardTitle>
        </CardHeader>

        <CardContent className={"p-4"}>
            <div className="space-y-2 flex items-center justify-between">
                <Skeleton className={"h-6 w-1/4 bg-muted-foreground/10 my-4"}/>
                <Skeleton className={"w-1/4 h-6 bg-muted-foreground/10 my-4"}/>
            </div>

            <div className="space-y-2 flex items-center justify-between">
                <Skeleton className={"h-6 w-1/2 bg-muted-foreground/10 my-4"}/>
                <Skeleton className={"w-1/8 h-6 bg-muted-foreground/10 my-4"}/>
            </div>


            <div className="flex itesm-center justify-center gap-4">
                <Skeleton className={buttonVariants({className: "mt-4  h-10 w-32 rounded" , variant: "outline" })}/>
            </div>
        </CardContent>
    </Card>
}
