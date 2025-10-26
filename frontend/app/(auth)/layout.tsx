import Link from 'next/link';
import React from 'react';
import {ArrowLeft} from "lucide-react";
import {buttonVariants} from "@/components/ui/button";
import Image from "next/image";
import AppLogoShape from "@/components/custom-ui/AppLogoShape";
import AppLogoText from "@/components/custom-ui/AppLogoText";

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={"relative flex min-h-svh flex-col items-center justify-center"}>
            <Link href={"/"} className={buttonVariants({variant: "outline", className: "absolute top-4 left-4"})}>
                <ArrowLeft className={"size-4"}/> Back
            </Link>
            <div className="flex flex-col w-full gap-6 max-w-sm ">
                <Link href={"/"} className={"flex items-center gap-2 self-center font-medium"}>
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
                {children}
                <div className="text-balance text-center text-xs text-muted-foreground">
                    By clicking continue, you agree to our
                    <Link href={"/"} className={"hover:text-primary hover:underline cursor-pointer"}>Terms of
                        Service</Link> and
                    <Link href={"/"} className={"hover:text-primary hover:underline cursor-pointer"}>Privacy
                        Policy</Link>
                </div>
            </div>
        </div>
    );
};

