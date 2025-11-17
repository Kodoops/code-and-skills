"use client";

import React, {useEffect, useState, useTransition} from "react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Archive, Loader2, Reply, Trash2} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {type Resolver, useForm} from "react-hook-form";
import {replyContactMessageSchema, ReplyContactMessageSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";

import {formatDate} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Badge} from "@/components/ui/badge";
import { useSession } from "@/hooks/useSession";
import { ContactMessage } from "@/models";
import {handleActionResult} from "@/lib/handleActionResult";
import {archiveContactMessage, deleteContactMessage} from "@/actions/auth/contact";
import Link from "next/link";
import {replyToContactMessage} from "@/actions/admin/contact";


const MessagesClient = ({messages, path}: { messages: ContactMessage[], path: string }) => {

    const {user, authenticated, isAdmin} = useSession();

    const [selected, setSelected] = useState<ContactMessage | null>(null);

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<ReplyContactMessageSchema>({
        resolver: zodResolver(replyContactMessageSchema) as Resolver<ReplyContactMessageSchema>,
        defaultValues: {
            response: "",
            adminId: user?.id,
            contactMessageId: selected?.id
        },
    })

    useEffect(() => {
        if (messages.length > 0 && !selected) {
            setSelected(messages[0]);
        }
    }, [messages, selected]);

    useEffect(() => {
        if (selected) {
            form.reset({
                response: "",
                adminId: user?.id,
                contactMessageId: selected.id,
            });
        }
    }, [selected, user?.id, form]);

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();
        startTransition(async () => {
             const result = await deleteContactMessage({id, userId: user?.id as string});

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Message supprimé !");
                    form.reset();
                    router.push(path);
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        })
    };

    const handleArchive = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();
        startTransition(async () => {
             const result= await archiveContactMessage({id, userId: user?.id as string});

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Message archivé !");
                    router.push(path);
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        })
    };

    const onSubmit = (values: ReplyContactMessageSchema) => {
        if (!selected) return;

        startTransition(async () => {
             const result = await replyToContactMessage(values);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Message archivé !");
                        form.reset();
                        setSelected(
                            messages.find((msg) => msg.id === values?.contactMessageId) ||
                            messages[0])
                        router.push(path);
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });

        })
    };

    return (
        <div className="flex flex-1 overflow-hidden max-h-[calc(100vh-14rem)]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border overflow-y-auto">
                <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2 border-b p-2 text-center">Messages</h3>
                    <div className="flex items-center justify-center p-2 gap-2 border-b text-xs ">
                        <Link href={"/dashboard/messages"} className={"border border-border rounded cursor-pointer p-2"}>All</Link>
                        <Link href={"/dashboard/messages?status=OPEN"} className={"border border-border rounded cursor-pointer p-2 bg-destructive"}>Open</Link>
                        <Link href={"/dashboard/messages?status=ANSWERED"} className={"border border-border rounded cursor-pointer p-2 bg-primary"}>Answered</Link>
                        <Link href={"/dashboard/messages?status=CLOSED"} className={"border border-border rounded cursor-pointer p-2 bg-secondary"}>Closed</Link>

                    </div>
                </div>
                {messages.length === 0 && <p className="text-muted-foreground">Aucun message</p>}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`relative w-full p-2 border-b cursor-pointer hover:bg-muted  p-2${
                            selected?.id === msg.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelected(msg)}
                    >
                        <Button variant="outline" size="icon"
                                onClick={(e) => handleDelete(e, msg.id!)}
                                className="absolute top-2 right-2 z-10"
                        >
                            <Trash2 className="w-4 h-4 mr-1"/>
                        </Button>
                        <p className="font-semibold line-clamp-2">{msg.subject}</p>
                        <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(msg.createdAt)}</p>
                        <Badge
                            variant={`${msg.status.toLowerCase() === "open" ? "destructive" : msg.status.toLowerCase() === "answered" ? "default" : "outline"}`}>
                            {msg.status}
                        </Badge>
                    </div>
                ))}
            </aside>
            {/* Détails */}
            {selected ? (
                <div className="flex-1 flex flex-col max-h-[calc(100vh-14rem)] overflow-y-auto">
                    {/* Header */}
                    <div className="h-16 flex justify-between items-center border-b p-4">
                        <h3 className="font-bold text-lg">{selected.subject}</h3>
                        <div className="flex items-center gap-2">
                            {selected.status.toLowerCase() !=="closed" && <Button
                                variant="outline"
                                className={"cursor-pointer"}
                                size="sm"
                                onClick={(e) => handleArchive(e, selected.id)}
                            >
                                <Archive className="w-4 h-4 mr-1"/> Archiver
                            </Button> }
                            <Button
                                variant="destructive"
                                className={"cursor-pointer"}
                                size="sm"
                                onClick={(e) => handleDelete(e, selected.id)}
                            >
                                <Trash2 className="w-4 h-4 mr-1"/>
                            </Button>
                        </div>
                    </div>

                    {/* Contenu scrollable */}
                    <ScrollArea className="flex-1 p-4 overflow-y-auto">
                        <p>{selected.message}</p>

                        <div className="mt-4">
                            {selected.replies.length > 0 ? (
                                <div className="mt-2 p-2 border-t  ">
                                    <h4 className="font-semibold">Réponses :</h4>
                                    {selected.replies.map((reply) => (
                                        <div
                                            key={reply.id}
                                            className="text-sm text-muted-foreground border p-2 rounded-lg bg-muted-foreground/10 my-2"
                                        >
                                            <span className="text-xs">({formatDate(reply.createdAt)})</span>
                                            <p>{reply.response} </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-primary mt-2 text-center italic my-3">
                                    Aucune réponse pour l’instant
                                </p>
                            )}
                        </div>
                    </ScrollArea>

                    <Separator/>

                    {/* Formulaire fixé en bas */}
                    {isAdmin && <div className="p-4 border-t h-48">
                        <Form {...form}>
                            <form
                                className="space-y-6"
                                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                                    console.log("Validation errors:", errors);
                                    toast.error("Veuillez corriger les erreurs du formulaire.");
                                })}
                            >
                                <FormField
                                    control={form.control}
                                    name="response"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Écrire une réponse..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <Button size="sm" type="submit" disabled={pending}>
                                    {pending ? (
                                        <>
                                            Sending ... <Loader2 className="size-4 animate-spin ml-1"/>
                                        </>
                                    ) : (
                                        <>
                                            <Reply className="w-4 h-4 mr-1"/> Répondre
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    Sélectionnez un message
                </div>
            )}
        </div>
    );
};

export default MessagesClient;
