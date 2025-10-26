import React from 'react';
import Link from "next/link";
import {cn} from "@/lib/utils";

const navigationItems = [
    { name: "Accueil", href: "/" },
    { name: "Catalogue", href: "/courses" },
    { name: "Ateliers", href: "/workshops" },
    { name: "Parcours", href: "/learning-paths" },
    { name: "Business", href: "/business" },
    { name: "Contact", href: "/contact" },
];

const NavContent = ({btnStyles}:{btnStyles?: string}) => {
    return (
        navigationItems.map((item) => (
            <Link
                href={item.href}
                key={item.name}
                className={cn("text-sm font-medium transition-colors hover:text-primary", btnStyles)}
            >
                {item.name}
            </Link>
        ))
    );
};

export default NavContent;
