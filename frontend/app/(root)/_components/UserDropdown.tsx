"use client"

import {
    ChevronDownIcon,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
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

export default function UserDropdown() {

    const {  user, logout, loading } = useSession();

    if (loading) return (
        <div className={"text-muted-foreground"}>Loading...</div>
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
                        <Avatar>
                            <AvatarImage src={user?.avatarUrl ?? `http://avatar.vercel.sh/${user?.email}`}
                                         alt="Profile image"/>
                            <AvatarFallback>
                                {name && name.length > 0 ? name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
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
