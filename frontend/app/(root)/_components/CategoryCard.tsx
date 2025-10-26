import React from "react";
import {cn} from "@/lib/utils";
import { resolveIcon} from "@/components/custom-ui/resolve-icon";
import { Earth} from "lucide-react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";
import {colorClasses} from "@/lib/theme";

export interface CategoryCardProps {
    title: string;
    slug:string;
    description?: string | null;
    iconName?: string| null;
    iconLib?: string| null;
    color?: string| null;
}

export default function CategoryCard({
                                         iconName,
                                         iconLib = "lucide",
                                         title,
                                         description,
                                         slug,
                                         color = "muted",
                                     }: CategoryCardProps) {
    const palette = colorClasses[color!] ?? colorClasses.muted;

    let IconComp: React.ComponentType<React.SVGProps<SVGSVGElement>> | null = null;

    if (iconName) {
        IconComp = resolveIcon(iconName, iconLib ?? 'lucide');
    }

    // Fallback
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
            {/* Icône BACKGROUND grand format (remplace le rond décoratif) */}
            <div
                className="pointer-events-none absolute -right-6 -top-6 "
                aria-hidden="true"
            >
                <IconComp width={180} height={180} className="text-foreground opacity-5"/>
            </div>

            {/* Contenu */}
            <Link className="relative" href={`/courses?categorySlug=${slug}`}>
                <CardHeader className={"flex  items-center gap-2 group"}>
                        <div className="mb-3 text-2xl">
                                    <IconComp
                                        width={40}
                                        height={40}
                                        className={palette.text}
                                    />
                        </div>

                        <h4 className={cn("text-lg font-semibold ", palette.text)}>{title}</h4>

                </CardHeader>
                <CardContent>
                    <div className=" text-center space-y-2">
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{description}</p>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}

export function CategoryCardSkeleton() {
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
