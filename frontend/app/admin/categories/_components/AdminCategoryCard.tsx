import React from "react";
import {cn} from "@/lib/utils";
import {resolveIcon} from "@/components/custom-ui/resolve-icon";
import {Earth, MoreVerticalIcon, PencilIcon, Trash2Icon} from "lucide-react";
import {Card, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import Pill from "@/components/custom-ui/Pill";
import {Skeleton} from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {colorClasses} from "@/lib/theme";

export interface CategoryCardProps {
    title: string;
    id: string;
    desc?: string | null;
    color?: string | null;
    iconName?: string | null;
    iconLib?: string | null;
    count?: number;
}

export default function AdminCategoryCard({
                                              iconName,
                                              iconLib = "lucide",
                                              title,
                                              id,
                                              desc,
                                              color = "muted",
                                              count,
                                          }: CategoryCardProps) {
    let palette =  {bg: "bg-muted", text: "text-muted-foreground"};
    if (color !== null) {
        palette = colorClasses[color] ?? colorClasses.muted;
    }

    let IconComp: React.ComponentType<React.SVGProps<SVGSVGElement>> | null = null;
    const libSafe = (iconLib ?? "lucide") as string;

    if (!iconName) {
        IconComp = Earth;
    } else {
        IconComp = resolveIcon(iconName, libSafe);
    }

    if (!IconComp) {
        IconComp = Earth;
    }

    return (
        <Card
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-2 transition hover:bg-white/10",
                "backdrop-blur-sm border-border",
            )}
        >
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"secondary"} size={"icon"}>
                            <MoreVerticalIcon className={"size-4"}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={"end"} className={"w-48"}>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/categories/${id}/edit`}>
                                <PencilIcon className={"size-4 mr-2"}/>
                                Edit Category
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/categories/${id}/delete`}>
                                <Trash2Icon className={"size-4 mr-2 text-destructive"}/>
                                Delete Category
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div
                className="pointer-events-none absolute -right-6 -top-6 "
                aria-hidden="true"
            >
                <IconComp width={180} height={180} className="text-foreground opacity-5"/>
            </div>

            <Link className="relative" href={`/admin/categories/${id}/edit`}>
                <CardHeader className={"flex flex-col justify-start items-start gap-2 group"}>
                    <div className="flex items-center gap-2 justify-start">
                        <div className="mb-3 text-2xl">
                            <IconComp
                                width={40}
                                height={40}
                                className={palette.text}
                            />
                        </div>

                        <h4 className={cn("text-lg font-semibold", palette.text)}>{title}</h4>
                    </div>
                    <div className=" text-center space-y-2">
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{desc}</p>
                        {typeof count === "number" && (
                            <Pill>{count} formations</Pill>
                        )}
                    </div>
                </CardHeader>
            </Link>
        </Card>
    );
}


export function AdminCategoryCardSkeleton() {
    return (
        <Card className={"rounded-2xl border border-white/10 bg-white/5 px-2 "}>
            <div className="flex items-center justify-between gap-2">
                <div className="space-y-2 ">
                    <Skeleton className={"w-12 h-12 rounded-full bg-foreground/10"}/>
                    <Skeleton className={"w-16 h-6 rounded-lg bg-foreground/10"}/>
                </div>
                <div className="flex-1 space-y-2">
                    <Skeleton className={"w-full h-4 rounded-lg bg-foreground/10"}/>
                    <Skeleton className={"w-3/4 h-4 rounded-lg bg-foreground/10"}/>
                </div>
            </div>
        </Card>
    )
}


export  function AdminDomainCard({
                                              iconName,
                                              iconLib = "lucide",
                                              title,
                                              id,
                                              desc,
                                              color = "muted",
                                              count,
                                          }: CategoryCardProps) {
    let palette =  {bg: "bg-muted", text: "text-muted-foreground"};
    if (color !== null) {
        palette = colorClasses[color] ?? colorClasses.muted;
    }

    let IconComp: React.ComponentType<React.SVGProps<SVGSVGElement>> | null = null;
    const libSafe = (iconLib ?? "lucide") as string;

    if (!iconName) {
        IconComp = Earth;
    } else {
        IconComp = resolveIcon(iconName, libSafe);
    }

    if (!IconComp) {
        IconComp = Earth;
    }

    return (
        <Card
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-2 transition hover:bg-white/10",
                "backdrop-blur-sm border-border",
            )}
        >
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"secondary"} size={"icon"}>
                            <MoreVerticalIcon className={"size-4"}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={"end"} className={"w-48"}>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/domains/${id}/edit`}>
                                <PencilIcon className={"size-4 mr-2"}/>
                                Edit Domain
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/domains/${id}/delete`}>
                                <Trash2Icon className={"size-4 mr-2 text-destructive"}/>
                                Delete Domain
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div
                className="pointer-events-none absolute -right-6 -top-6 "
                aria-hidden="true"
            >
                <IconComp width={180} height={180} className="text-foreground opacity-5"/>
            </div>

            <Link className="relative" href={`/admin/domains/${id}/edit`}>
                <CardHeader className={"flex flex-col justify-start items-start gap-2 group"}>
                    <div className="flex items-center gap-2 justify-start">
                        <div className="mb-3 text-2xl">
                            <IconComp
                                width={40}
                                height={40}
                                className={palette.text}
                            />
                        </div>

                        <h4 className={cn("text-lg font-semibold", palette.text)}>{title}</h4>
                    </div>
                    <div className=" text-center space-y-2">
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{desc}</p>
                        {typeof count === "number" && (
                            <Pill>{count} formations</Pill>
                        )}
                    </div>
                </CardHeader>
            </Link>
        </Card>
    );
}
