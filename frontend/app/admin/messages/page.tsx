import React from 'react';
import {Separator} from "@/components/ui/separator";
import Pagination from "@/components/general/Pagination";
import {MESSAGES_PER_PAGE} from '@/constants/user-contants';
import MessagesClient from "@/app/dashboard/messages/_components/MessagesClient";
import NewMessageDialog from "@/app/dashboard/messages/_components/NewMessageDialog";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import { cn } from '@/lib/utils';
import {requireUser} from "@/actions/auth/requireUser";
import {redirect} from "next/navigation";
import CardError from "@/components/custom-ui/CardError";
import {getMessages} from "@/actions/admin/contact";

const MessagesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
        status?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "0", 10);
    const status= params?.status;

    const  user  = await requireUser();
    if(!user) return redirect("/login");

    const result = await getMessages({ page,size: MESSAGES_PER_PAGE, status});

    if(!result || result.status === "error") return <CardError  message={result.message} title={"Erreur de chargement des méssages du l'utilisateur"} />

    const messages = result.data?.content;

    return (
        <div className="min-h-[calc(100vh-150px)] border border-border my-6 rounded-lg flex flex-col">
            <h2 className="text-center my-4 text-xl text-muted-foreground flex items-center justify-between">
                <div className={"flex-1 text-center"}>
                 <span> Boite de réception des messages</span>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <span className={"font-semibold text-xs"}>Filters : </span>
                        <Link href={`/admin/messages?page=${page}&status=`}
                              className={cn(buttonVariants({size:"sm" , variant: "secondary"}))}> All </Link>
                        <Link href={`/admin/messages?page=${page}&status=OPEN`}
                              className={cn(buttonVariants({size:"sm" , variant: "destructive"}))}> Open </Link>
                        <Link href={`/admin/messages?page=${page} &status=ANSWERED`}
                              className={cn(buttonVariants({size:"sm" , variant: "default"}))}> Answered </Link>
                        <Link href={`/admin/messages?page=${page}&status=CLOSED`}
                              className={cn(buttonVariants({size:"sm" , variant: "outline"}))}> Closed </Link>
                    </div>
                </div>
                <NewMessageDialog/>
            </h2>

            <Separator/>

            <div className="flex flex-1 overflow-hidden">
                {messages ? <MessagesClient messages={messages} path={"/admin/messages"}/> :
                    <div className="flex w-full justify-center items-center h-full">
                        <p className="text-center text-muted-foreground text-lg">
                            Aucun message de disponible pour le moment.
                        </p>
                    </div>
                }
            </div>
            {result.data?.totalPages && result.data?.totalPages > 1 && <div className="border-t border-border p-2">
                <Pagination totalPages={result.data?.totalPages} page={page}/>
            </div>}
        </div>
    );
};

export default MessagesPage;
