// components/ui/GradientText.tsx
import React from "react";

export default function GradientText({
                                         children,
                                         from,
                                         to,
                                     }: React.PropsWithChildren<{ from: string; to: string }>) {
    return (
        <span
            className="bg-clip-text text-transparent "
            style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
        >
      {children}
    </span>
    );
}
