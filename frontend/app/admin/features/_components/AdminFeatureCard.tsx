import React from "react";
import {cn} from "@/lib/utils";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CircleOff, MoreVerticalIcon, PencilIcon, Trash2Icon} from "lucide-react";
import { resolveIcon} from "@/components/custom-ui/resolve-icon";
import {Skeleton} from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {colorClasses} from "@/lib/theme";

export interface AdminFeatureCardProps {
    iconName?: string;
    iconLib?: string;
    id:string;
    title: string;
    desc: string;
    color?: string;
}

export default function AdminFeatureCard({
                                             id,
                                             iconName,
                                             iconLib = "lucide",
                                             title,
                                             desc,
                                             color = "muted",
                                         }: AdminFeatureCardProps) {
    const palette = colorClasses[color] ?? colorClasses.muted;

    const renderFromName = () => {
        if (iconName) {
            const Resolved = resolveIcon(iconName, iconLib);
            if (Resolved) {
                return <Resolved width={40} height={40} className={palette.text}/>;
            }
        }
        return null;
    };

    const renderIcon =
       renderFromName() ?? (
            <CircleOff width={40} height={40} className="text-muted-foreground"/>
        );

    return (
        <Card className={cn("hover:shadow-lg transition-shadow relative", palette.bg)}>
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"secondary"} size={"icon"}>
                            <MoreVerticalIcon className={"size-4"}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={"end"} className={"w-48"}>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/features/${id}/edit`}>
                                <PencilIcon className={"size-4 mr-2"}/>
                                Edit Feature
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/features/${id}/delete`}>
                                <Trash2Icon className={"size-4 mr-2 text-destructive"}/>
                                Delete Feature
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <CardHeader>
                <div className="text-4xl mb-4">{renderIcon}</div>
                <CardTitle className="text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{desc}</p>
            </CardContent>
        </Card>
    );
}


export function AdminFeatureCardSkeleton() {
    return (
        <Card className={"rounded-2xl border border-white/10 bg-white/5 px-2 "}>
            <div className="flex items-center justify-between gap-2">

                <div className="flex-1 space-y-2">
                    <Skeleton className={"w-12 h-12 rounded-full bg-foreground/10"}/>
                    <Skeleton className={"w-3/4 h-8 rounded-lg bg-foreground/10 mb-2"}/>
                    <Skeleton className={"w-full h-4 rounded-lg bg-foreground/10"}/>
                    <Skeleton className={"w-3/4 h-4 rounded-lg bg-foreground/10"}/>
                </div>
            </div>
        </Card>
    )
}
