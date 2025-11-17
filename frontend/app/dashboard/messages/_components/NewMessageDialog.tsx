"use client";

import React, {useState} from 'react';
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";
import {MailPlus} from "lucide-react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ContactForm from "@/app/(root)/contact/_component/ContactForm";

const NewMessageDialog = () => {
    const [open, setOpen] = useState(false);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className={cn(buttonVariants())}>
                    <MailPlus className={"size-4"}/> Nouveau Message
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <ContactForm onSuccess={() => setOpen(false)}/>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default NewMessageDialog;
