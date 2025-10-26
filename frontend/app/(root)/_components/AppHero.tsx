import GradientText from '@/components/custom-ui/GradientText';
import Pill from '@/components/custom-ui/Pill';
import { buttonVariants } from '@/components/ui/button';
import { theme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import Stats from "@/app/(root)/_components/Stats";
import {headers} from "next/headers";

const AppHero = async () => {
    // const session = await auth.api.getSession(
    //     {headers: await headers(),}
    // );

    const session = {user:null}
    return (
        <section className={"relative py-20"}>
            <div className={"flex flex-col items-center text-center space-y-8"}>

                <div className="mb-4 flex flex-wrap items-center justify-center gap-6">
                    <Pill bgColor={"bg-accent"}> Réinventer l’éducation en ligne</Pill>
                    <Pill bgColor={"bg-primary"}>Nouvelle plateforme</Pill>
                    <Pill bgColor={"bg-muted-foreground"}>Parcours personnalisés</Pill>
                </div>
                <h1 className={"text-4xl md:text-6xl font-bold tracking-tight max-w-[980px]"}>
                    Apprends à <GradientText from={theme.colors.orangeFrom}
                                             to={theme.colors.orangeTo}>coder</GradientText> & développe
                    tes <GradientText from={theme.colors.blueFrom}
                                      to={theme.colors.blueTo}>compétences</GradientText>
                </h1>
                <p className={"max-w-[700px] text-muted-foreground md:text-xl"}>
                    Des cours modernes, des exercices corrigés, des parcours guidés et un suivi de progression. Du
                    débutant au pro.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">


                    <Link href={"/courses"}
                          className={cn(buttonVariants(), "rounded-2xl p-6 text-sm font-semibold text-white shadow transition hover:opacity-95",
                          )}
                          style={{backgroundImage: theme.gradients.blue}}
                    >
                        Parcourir les formations
                    </Link>
                    {session?.user ?
                        <Link href={"/newsletter"}
                              className={cn(buttonVariants({variant: "outline"}), "rounded-2xl  p-6 text-sm font-semibold transition",
                              )}
                        > Recevoir les nouveautés</Link>
                        :
                        <Link href={"/signin"}
                              className={cn(buttonVariants(), "rounded-2xl border border-white/15  p-6 text-sm font-semibold text-white/90 transition",
                              )}
                        > Commencer a apprendre</Link>
                    }

                    {/*Statistiques*/}
                    <Stats/>
                </div>
            </div>
        </section>
    );
};

export default AppHero;
