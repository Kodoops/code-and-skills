"use client";

import { cn } from "@/lib/utils";
import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";

function chunk<T>(arr: T[], size: number): T[][] {
    if (!arr || arr.length === 0) return [];
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

type GridBreakpoints = {
    lgCols?: number;
    smCols?: number;
    baseCols?: number;
};

type CarouselGridProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    perPage?: number;
    loop?: boolean;
    className?: string;
    itemKey?: (item: T, index: number) => string | number;
    grid?: GridBreakpoints;
    autoplayMs?: number;
};

export default function CarouselGrid<T>({
                                            items,
                                            renderItem,
                                            perPage = 6,
                                            loop = true,
                                            className,
                                            itemKey,
                                            grid = { baseCols: 1, smCols: 2, lgCols: 3 },
                                            autoplayMs = 0,
                                        }: CarouselGridProps<T>) {
    const pages = useMemo(() => chunk(items, perPage), [items, perPage]);
    const total = pages.length || 1;
    const [page, setPage] = useState(0);

    const go = useCallback(
        (dir: "prev" | "next" | number) => {
            if (typeof dir === "number") {
                setPage(Math.max(0, Math.min(dir, total - 1)));
                return;
            }
            if (dir === "next") {
                setPage((p) => (loop ? (p + 1) % total : Math.min(p + 1, total - 1)));
            } else {
                setPage((p) => (loop ? (p - 1 + total) % total : Math.max(p - 1, 0)));
            }
        },
        [loop, total]
    );

    // clavier
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") go("next");
            if (e.key === "ArrowLeft") go("prev");
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go]);

    // autoplay
    useEffect(() => {
        if (!autoplayMs || total <= 1) return;
        const id = setInterval(() => go("next"), autoplayMs);
        return () => clearInterval(id);
    }, [autoplayMs, go, total]);

    // swipe/touch
    const startX = useRef<number | null>(null);
    const deltaX = useRef(0);
    const onTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        deltaX.current = 0;
    };
    const onTouchMove = (e: React.TouchEvent) => {
        if (startX.current == null) return;
        deltaX.current = e.touches[0].clientX - startX.current;
    };
    const onTouchEnd = () => {
        if (Math.abs(deltaX.current) > 40) {
            if (deltaX.current < 0) go("next");
            else go("prev");
        }
        startX.current = null;
        deltaX.current = 0;
    };

    if (!items?.length) return null;

    const baseCols = grid.baseCols ?? 1;
    const smCols = grid.smCols ?? 2;
    const lgCols = grid.lgCols ?? 3;

    // ✅ Grille universelle via variables CSS (aucune classe dynamique)
    // base: --cols ; sm: --cols-sm ; lg: --cols-lg
    const gridClass = cn(
        "grid gap-5 lg:[grid-auto-rows:1fr]",
        "[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]",
        "sm:[grid-template-columns:repeat(var(--cols-sm),minmax(0,1fr))]",
        "lg:[grid-template-columns:repeat(var(--cols-lg),minmax(0,1fr))]"
    );

    return (
        <div className={cn("relative", className)}>
            {total > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Précédent"
                        onClick={() => go("prev")}
                        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm backdrop-blur hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        aria-label="Suivant"
                        onClick={() => go("next")}
                        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm backdrop-blur hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        →
                    </button>
                </>
            )}

            <div
                className="overflow-hidden rounded-2xl"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${page * 100}%)` }}
                >
                    {pages.map((group, i) => (
                        <div key={i} className="min-w-full px-0 sm:px-1">
                            {/* 👇 Ici on utilise gridClass + on injecte les valeurs responsive en variables */}
                            <div
                                className={gridClass}
                                style={
                                    {
                                        ["--cols" as any]: baseCols,
                                        ["--cols-sm" as any]: smCols,
                                        ["--cols-lg" as any]: lgCols,
                                    } as React.CSSProperties
                                }
                            >
                                {group.map((item, idx) => {
                                    const key = itemKey?.(item, idx) ?? idx;
                                    return <React.Fragment key={key}>{renderItem(item, idx)}</React.Fragment>;
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {total > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    {Array.from({ length: total }).map((_, i) => (
                        <button
                            key={i}
                            aria-label={`Aller à la page ${i + 1}`}
                            onClick={() => go(i)}
                            className={cn(
                                "h-2 w-2 rounded-full transition",
                                i === page ? "bg-primary w-6" : "bg-white/30 hover:bg-white/50"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
