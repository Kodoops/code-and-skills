import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {CircleOff} from "lucide-react";
import {  resolveIcon } from "@/components/custom-ui/resolve-icon";
import {Skeleton} from "@/components/ui/skeleton";
import {colorClasses} from "@/lib/theme";

export interface FeatureCardProps {
    /** 1) Élément JSX d’icône (ex: <Route />) */
    icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    /** 2) Composant d’icône (ex: Route) */
    iconComponent?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    /** 3) Ou nom + lib, résolu via resolveIcon */
    iconName?: string;
    iconLib?: string;

    iconSize?: number;
    title: string;
    desc: string;
    color?: string;
    className?: string;
}

export default function FeatureCard({
                                        icon,
                                        iconComponent,
                                        iconName,
                                        iconLib = "lucide",
                                        iconSize = 40,
                                        title,
                                        desc,
                                        color = "muted",
                                        className,
                                    }: FeatureCardProps) {
    const palette = colorClasses[color] ?? colorClasses.muted;

    // 1) Si on a un élément JSX valide, on le clone en ajoutant width/height/className
    const renderFromElement = () => {
        if (icon && React.isValidElement<React.SVGProps<SVGSVGElement>>(icon)) {
            return React.cloneElement<React.SVGProps<SVGSVGElement>>(icon, {
                width: iconSize,
                height: iconSize,
                className: cn(palette.text, icon.props.className),
            });
        }
        return null;
    };

    // 2) Sinon si on a un composant, on l’instancie
    const renderFromComponent = () => {
        if (iconComponent) {
            const Comp = iconComponent;
            return <Comp width={iconSize} height={iconSize} className={palette.text} />;
        }
        return null;
    };

    // 3) Sinon on tente la résolution par nom/lib
    const renderFromName = () => {
        if (iconName) {
            const Resolved = resolveIcon(iconName, iconLib);
            if (Resolved) {
                return <Resolved width={iconSize} height={iconSize} className={palette.text} />;
            }
        }
        return null;
    };

    // 4) Fallback Earth
    const renderIcon =
        renderFromElement() ?? renderFromComponent() ?? renderFromName() ?? (
            <CircleOff width={iconSize} height={iconSize} className="text-muted-foreground" />
        );

    return (
        <Card className={cn("hover:shadow-lg transition-shadow", palette.bg, className)}>
            <CardHeader>
                <div className="text-4xl mb-4">{renderIcon}</div>
                <CardTitle className="text-muted-foreground" >{title}</CardTitle>
            {/*    className={cn(palette.text)}*/}
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{desc}</p>
            </CardContent>
        </Card>
    );
}



export function FeatureCardSkeleton() {
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
