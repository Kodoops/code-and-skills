"use client";

import React from 'react';
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {useSession} from "@/hooks/useSession";
import {Loader2} from "lucide-react";

const NewsOrRegisterBtn = () => {
    const {authenticated, loading} = useSession();

    if(loading) return (
        <Loader2 className="animate-spin" />
    )

    return (authenticated ?
                <Link href={"/pages/newsletter"}
                      className={cn(buttonVariants({variant: "outline"}), "rounded-2xl  p-6 text-sm font-semibold transition",
                      )}
                > Recevoir les nouveautés</Link>
                :
                <Link href={"/register"}
                      className={cn(buttonVariants(), "rounded-2xl border border-white/15  p-6 text-sm font-semibold text-white/90 transition",
                      )}
                > Commencer a apprendre</Link>
    );
};

export default NewsOrRegisterBtn;