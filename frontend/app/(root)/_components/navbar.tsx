"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {ThemeToggle} from "@/components/ui/themeToggle";
import UserDropdown from "@/app/(root)/_components/UserDropdown";
import {Menu, X} from "lucide-react";
import {usePathname} from "next/navigation";
import AppLogoShape from "@/components/custom-ui/AppLogoShape";
import NavContent from "./NavContent";
import AppLogoText from "@/components/custom-ui/AppLogoText";
import UserMobileLink from "@/app/(root)/_components/UserMobileLink";


const Navbar = () => {

    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 mr-4">
                    <AppLogoShape
                        logo="/logo/code&skills-transparent.png"
                        width={80}
                        height={80}
                        priority={true}
                    />
                    <AppLogoText
                        logo="/logo/CODE_SKILLS_cropped.png"
                        alt="code and skills text"
                        width={250}
                        height={200}
                        priority
                    />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
                    <div className="flex items-center space-x-2 flex-1 justify-center gap-6">
                        <NavContent/>
                    </div>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle/>
                        <UserDropdown/>

                    </div>
                </nav>

                {/* Mobile actions (right) */}
                <div className="ml-auto flex items-center gap-2 lg:hidden">
                    <ThemeToggle/>
                    <button
                        type="button"
                        aria-label="Ouvrir le menu"
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent"
                    >
                        {open ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
                    </button>
                </div>
            </div>

            {/* Mobile panel */}
            <div
                id="mobile-nav"
                hidden={!open}
                className="lg:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
                <nav className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
                    <ul className="flex flex-col gap-2">
                        <NavContent/>
                    </ul>

                    <div className="mt-4 h-px bg-border"/>

                    <UserMobileLink/>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
