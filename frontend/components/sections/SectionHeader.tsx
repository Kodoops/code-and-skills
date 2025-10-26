import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {LEVELS} from "@/models";

interface Props {
    title: string;
    btnList?: string[];
    btnListHref?: string;
    btnLink?: React.ReactNode;
}

const SectionHeader = ({ title, btnList, btnListHref, btnLink }: Props) => {
    return (
        <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h3 className="text-xl font-bold">{title}</h3>

            {btnList && (
                <div className="hidden lg:flex flex-wrap items-center gap-2 text-xs">
                    {btnList.map((item, index) => {
                        const level = LEVELS.find((lvl) => lvl === item);

                        if (!level) return null;

                        return (
                            <Button
                                key={index}
                                asChild
                                variant="ghost"
                                className="rounded-xl border  border-border px-3 py-2 text-sm "
                            >
                                <Link href={`${btnListHref}?level=${level}`}>{item}</Link>
                            </Button>
                        );
                    })}
                </div>
            )}

            {btnLink && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    {btnListHref && (
                        <Button
                            asChild
                            variant="ghost"
                            className=" border border-border px-3 py-1 "
                        >
                            <Link href={btnListHref}>Voir plus ...</Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SectionHeader;
