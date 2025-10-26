// components/custom-ui/resolve-icon.ts
import * as Lucide from "lucide-react";
import * as Fa from "react-icons/fa"; // FontAwesome
import * as Tb from "@tabler/icons-react";

import * as Si from "react-icons/si"

export type IconLib = "lucide" | "fa" | "tabler";

/**
 * Résout une icône dynamiquement en fonction de la lib choisie
 */
export function resolveIcon(
    name: string,
    lib: string,
    //IconLib
): React.ComponentType<React.SVGProps<SVGSVGElement>> | null {
    switch (lib) {
        case "lucide":
            return (Lucide as Record<string, any>)[name] || null;
        case "fa":
            return (Fa as Record<string, any>)[name] || null;
        case "si":
            return (Si as Record<string, any>)[name] || null;
        case "tabler":
            return (Tb as Record<string, any>)[name] || null;
        default:
            return null;
    }
}
