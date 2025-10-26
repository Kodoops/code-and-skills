import React from 'react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {BookOpen, BrickWall, HomeIcon, LayoutDashboardIcon, LogOutIcon} from "lucide-react";
import LogoutAllButton from "@/app/dashboard/_components/LogoutAllButton";
import {UserProfile} from "@/models";

const UserDropDownMenuContent = ({user, logout}:{user:UserProfile, logout: ()=> void}) => {

    const name = user?.firstname + " " + user?.lastname
    return (
        <>

            <DropdownMenuLabel className="flex min-w-0 flex-col">
                              <span className="text-foreground truncate text-sm font-medium">
                                {name ? name : user?.email.split("@")[0]}
                              </span>
                <span className="text-muted-foreground truncate text-xs font-normal">
                                {user?.email}
                              </span>
                <span className="text-muted-foreground truncate text-xs font-normal">
                        {user?.premium ? "Premium" : "Free"}
                    </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                        <HomeIcon size={16} className="opacity-60" aria-hidden="true"/>
                        <span>Mon Profil</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                        <LayoutDashboardIcon size={16} className="opacity-60" aria-hidden="true"/>
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                        <BookOpen size={16} className="opacity-60" aria-hidden="true"/>
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            {user?.role === "author" &&
                <><DropdownMenuSeparator/>

                    <DropdownMenuItem asChild>
                        <Link href="/author">
                            <BrickWall size={16} className="opacity-60" aria-hidden="true"/>
                            <span>Espace Auteur</span>
                        </Link>
                    </DropdownMenuItem>
                </>
            }
            {user?.role?.toUpperCase() === "ADMIN" &&
                <><DropdownMenuSeparator/>

                    <DropdownMenuItem asChild>
                        <Link href="/admin">
                            <BrickWall size={16} className="opacity-60" aria-hidden="true"/>
                            <span>Administration</span>
                        </Link>
                    </DropdownMenuItem>
                </>
            }
            <DropdownMenuSeparator/>

            <DropdownMenuItem onClick={logout}>
                <LogOutIcon size={16} className="opacity-60" aria-hidden="true"/>
                <span>Logout</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
                <LogoutAllButton/>
            </DropdownMenuItem>
        </>
    );
};

export default UserDropDownMenuContent;