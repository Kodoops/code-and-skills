// components/ui/Pill.tsx
import React from "react";

export default function Pill({bgColor, txtColor, children}: {
    bgColor?: string,
    txtColor?: string;
    children: React.ReactNode
}) {
    return (
        <span
            className={`inline-flex items-center rounded-full border border-white/20 px-3 py-1
             text-xs  backdrop-blur ${bgColor ? bgColor : ""}  ${txtColor ? txtColor : "text-white/80"}` }>
      {children}
    </span>
    );
}
