// components/ui/Stars.tsx
import React from "react";
export default function Stars({ value = 5 }: { value?: number }) {
    return (
        <div aria-label={`${value} sur 5`} className="text-lg leading-none">
            {Array.from({ length: 5 }).map((_, i) => <span key={i}>{i < value ? "★" : "☆"}</span>)}
        </div>
    );
}
