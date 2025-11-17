"use client"

import {
    IconDotsVertical,
} from "@tabler/icons-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import React from "react";
import {useSession} from "@/hooks/useSession";
import {useRouter} from "next/navigation";
import UserDropDownMenuContent from "@/components/sidebar/UserDropDownMenuContent";
import UserAvatar from "@/components/UserAvatar";

export function NavUser() {
    const {isMobile} = useSidebar();

    const {user, loading, logout} = useSession();

    if (loading) return (
        <div className={"text-muted-foreground"}>Loading...</div>
    )

    if (!user) {
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <UserAvatar name={user?.firstname + " " + user?.lastname} avatarUrl={user?.avatarUrl} />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.firstname + " " + user?.lastname}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
                            </div>
                            <IconDotsVertical className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        {user && <UserDropDownMenuContent user={user} logout={logout}/>}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
