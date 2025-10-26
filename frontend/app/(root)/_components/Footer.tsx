import React from 'react';
import Link from "next/link";
import Section from '@/components/sections/Section';
import AppLogoShape from "@/components/custom-ui/AppLogoShape";
import NavContent from "@/app/(root)/_components/NavContent";
import {CompanySocialLinks} from "@/app/(root)/_components/CompanySocialLinks";
import AppLogoText from "@/components/custom-ui/AppLogoText";
import {getCompanySocialLinks} from "@/actions/company";
import {getPageLinks} from "@/actions/page";
import {CompanySocialLink, Page} from "@/models";

const Footer = async () => {

    const socials : CompanySocialLink [] = await getCompanySocialLinks();
    const links: Page[] = await getPageLinks("Footer");

    return (
        <footer className="border-t border-border py-10">
            <Section>
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="text-center justify-center">
                        <AppLogoShape
                            logo="/logo/code&skills-transparent.png"
                            width={200}
                            height={200}
                            priority={true}
                        />
                        <AppLogoText
                            logo="/logo/CODE_SKILLS_cropped.png"
                            alt="code and skills text"
                            width={250}
                            height={200}
                            priority
                        />
                    </div>
                    <div className="flex flex-col md:flex-row flex-1 items-center justify-between gap-6">
                        <div className="flex-1 w-full">
                            <h2 className={"text-lg mb-4 font-semibold text-muted-foreground"}>Liens utils</h2>
                            <nav
                                className=" w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 text-sm  ">
                                <NavContent btnStyles={"text-sm text-muted-foreground/80 hover:text-primary "}/>
                            </nav>
                        </div>
                        <div className="flex-1">
                            <h2 className={"text-lg  text-right mb-4 font-semibold text-muted-foreground"}>Restez
                                connecté avec
                                nous !</h2>
                            <CompanySocialLinks links={socials}/>
                        </div>
                    </div>
                </div>
            </Section>
            <Section className="py-6  ">
                <nav className="flex  flex-wrap items-center justify-center gap-4 text-xs  text-muted-foreground/70">
                    <p className="mt-1 text-xs ">© {new Date().getFullYear()} Code&Skills — Tous droits
                        réservés.</p>
                    {links && links?.map((link, index) => (
                        <Link key={link.id} href={`/pages/${link.slug}`} className="hover:text-primary">{link.title}</Link>
                    ))}
                </nav>
            </Section>
        </footer>
    )
        ;
};

export default Footer;
