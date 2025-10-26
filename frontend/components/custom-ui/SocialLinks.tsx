// components/general/SocialLinks.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadIcon } from "@/lib/loadIcon";
import { getCompanySocialLinks } from "@/app/data/get-company-social-links";

type SocialLink = {
    id: string;
    name: string;
    url: string;
    iconLib: string;
    iconName: string;
};

export default function SocialLinks() {
    const [links, setLinks] = useState<SocialLink[]>([]);

    useEffect(() => {
        getCompanySocialLinks().then(setLinks);
    }, []);

    return (
        <div className="flex flex-col items-end gap-2">
            <h2 className="text-lg text-right font-semibold">Restez connecté avec nous !</h2>
            <div className="flex gap-4 justify-end items-center">
                {links.map((link) => {
                    try {
                        const Icon = loadIcon(link.iconLib, link.iconName);
                        return (
                            <Link key={link.id} href={link.url} target="_blank">
                                <Icon className="size-6 text-muted-foreground hover:text-primary transition" />
                            </Link>
                        );
                    } catch (error) {
                        console.warn(`Icon not found for: ${link.iconLib}/${link.iconName}`);
                        return null;
                    }
                })}
            </div>
        </div>
    );
}
