import React from 'react';
import {ArrowLeft, ConstructionIcon} from "lucide-react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

const Soon = () => {
    return (
        <div
            className="flex flex-col items-center justify-center flex-1 h-full rounded-md border-dashed p-8 text-center animate-in fade-in-50">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
                <ConstructionIcon className="size-10 text-primary"/>
            </div>
            <h2 className="mt-6 text-xl font-semibold">Bientôt ...</h2>
            <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground">
                La page ou fonctionalité est en cours de développemeent , elle arrivera bienôt sur la plateforme.
            </p>
            <Link href="/" className={buttonVariants()}>
                <ArrowLeft className="size-4 mr-2"/>
                Retour a l'acceuil
            </Link>
        </div>
    );
};

export default Soon;