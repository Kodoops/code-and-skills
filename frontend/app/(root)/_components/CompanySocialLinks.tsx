"use client"

import Link from "next/link"
import * as SiIcons from "react-icons/si";
import {DynamicIcon} from "@/app/(root)/_components/DynamicIcon";

type Props = {
    links: {
        id: string
        url: string
        socialLink: {
            name: string
            iconLib: string
            iconName: string
        }
    }[] | null
}

export function CompanySocialLinks({ links }: Props) {

    if (!links || links.length === 0) return null

    return (
        <div className="flex gap-6 justify-end items-center cursor-pointer">
            {links.map((link) => {
                const Icon = SiIcons[link.socialLink.iconName as keyof typeof SiIcons];
                if (!Icon) return null;

                return (
                    <Link
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <DynamicIcon
                            lib={link.socialLink.iconLib}
                            name={link.socialLink.iconName}
                            className="size-6 text-muted-foreground hover:text-primary"
                        />
                    </Link>
                )
            })}
        </div>
    )
}
