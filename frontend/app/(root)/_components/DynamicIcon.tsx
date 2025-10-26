import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import * as TbIcons from "react-icons/tb";
import * as AllLucideIcons from "lucide-react";
import { pickBy } from "lodash";
import type { ComponentType } from "react"

type DynamicIconProps = {
    lib: string;       // ex: 'si', 'fa', 'tabler','lucide
    name: string;      // ex: 'SiFacebook', 'FaGithub', 'TbSettings'
    className?: string;
};

const LucideIcons = pickBy(AllLucideIcons, (icon) => typeof icon === "function") as Record<string, ComponentType<any>>;

export const iconLibraries: Record<string, Record<string, ComponentType<any>>> = {
    si: SiIcons,
    fa: FaIcons,
    tabler: TbIcons,
    lucide: LucideIcons,
};

export function DynamicIcon({ lib, name, className }: DynamicIconProps) {
    const library = iconLibraries[lib.toLowerCase()];
    const IconComponent = library?.[name];

    if (!IconComponent) return null;

    return <IconComponent className={className} />;
}
