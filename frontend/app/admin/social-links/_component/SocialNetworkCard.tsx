"use client";

import {resolveIcon} from "@/components/custom-ui/resolve-icon";
import {CircleOff, Trash2Icon} from "lucide-react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import React from "react";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {unlinkSocialNetwork} from "@/actions/admin/social-networks";
import {SocialLink} from "@/models";
import {useRouter} from "next/navigation";

export function SocialNetworkCard({item}:{item:SocialLink & {url:string}}) {
    const router = useRouter();

    const handleUnlink =async (id: string) => {
        await unlinkSocialNetwork(id);

        router.push("/admin/social-links");
        toast.success("Social Network deleted successfully", {
            style: {
                background: "#D1FAE5",
                color: "#065F46",
            },
        });
    }


    const renderFromName = () => {
        if (item.iconName) {
            const Resolved = resolveIcon(item.iconName, item.iconLib);
            if (Resolved) {
                return <Resolved width={120} height={120}
                                 className={"text-muted-foreground w-12 h-12"}/>;
            }
        }
        return null;
    };

    const renderIcon =
        renderFromName() ?? (
            <CircleOff width={120} height={120} className="text-muted-foreground w-12 h-12"/>
        );

    return (
        <Card key={item.id} className={"text-center relative"}>
            <div className="absolute top-4 right-4 z-10">
                <Button onClick={()=>handleUnlink(item.id)} variant={"outline"} className={"cursor-pointer"}>
                    <Trash2Icon className={"size-6 mr-2 text-muted-foreground hover:text-destructive"}/>
                </Button>
            </div>
            <CardHeader className={"flex justify-center"}>
                {renderIcon}
            </CardHeader>
            <CardContent>
                {item.name}
                {item.url && <p className={" text-xs text-primary"}>{item.url}</p>}
            </CardContent>
        </Card>
    )
}
