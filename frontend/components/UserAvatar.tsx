"use client"

import React from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import UserSVG from "@/components/custom-ui/UserSVG";
import {useConstructUrl} from "@/hooks/use-construct-url";

const UserAvatar = ({avatarUrl, name}:{avatarUrl?:string, name:string}) => {
   const avatar = useConstructUrl(avatarUrl??"");
    return (
        <Avatar>
            <AvatarImage src={avatar }
                         alt={name || "User Profile"}/>
            <AvatarFallback className={"text-muted-foreground"}>
                <div className=" bg-muted-foreground/10 rounded-full border-2 p-0.5  ">
                    <UserSVG/>
                </div>
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;