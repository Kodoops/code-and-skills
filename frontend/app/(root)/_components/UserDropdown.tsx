"use client"

import {
    ChevronDownIcon, Loader2,
} from "lucide-react"

import {Button, buttonVariants} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import {useSession} from "@/hooks/useSession";
import React from "react";
import UserDropDownMenuContent from "@/components/sidebar/UserDropDownMenuContent";
import UserAvatar from "@/components/UserAvatar";

export default function UserDropdown() {

    const {  user, logout, loading } = useSession();

    if (loading) return (
        <div className={"text-muted-foreground"}>
            <Loader2 className={"animate-spin"}/>
        </div>
    )

    if (!user) {
        return (
            <>
                <Link href="/login" className={buttonVariants({ variant: "secondary" })}>
                    Se connecter
                </Link>
                <Link href="/signin" className={buttonVariants()}>
                    Commencer
                </Link>
            </>
        );
    }

    const name = user?.firstname + " " + user?.lastname

    return (
       <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                        <UserAvatar avatarUrl={user?.avatarUrl}  name={name}/>
                        <ChevronDownIcon
                            size={16}
                            className="opacity-60"
                            aria-hidden="true"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-48" align="end">
                    {user && <UserDropDownMenuContent user={user} logout={logout}/>}
                </DropdownMenuContent>
            </DropdownMenu>

    )
}
