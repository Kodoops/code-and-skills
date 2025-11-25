"use client";

import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
    label: string;
    value: number | string;
    icon: ReactNode;
    helperText?: string;
    className?: string;
};

export function StatCard({
                             label,
                             value,
                             icon,
                             helperText,
                             className,
                         }: StatCardProps) {
    return (
        <Card className={cn("@container/card", className)}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                <div>
                    <CardDescription>{label}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {value}
                    </CardTitle>
                </div>
                <div className="shrink-0">
                    {icon}
                </div>
            </CardHeader>
            {helperText && (
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <p className="text-muted-foreground">{helperText}</p>
                </CardFooter>
            )}
        </Card>
    );
}