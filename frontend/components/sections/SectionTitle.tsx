import React from 'react';
import {cn} from "@/lib/utils";

interface Props {
    title: string;
    subTitle?:string;
    children?: React.ReactNode;
    titleStyle?: string;
}

const SectionTitle = ({title, children,titleStyle, subTitle}:Props) => {
    return (
        <div className="mb-8 text-center ">
            <h2 className={cn("text-2xl font-bold flex flex-col items-center", titleStyle)}>
                <span>{title}</span> {children}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground/70">{subTitle}</p>
        </div>
    );
};

export default SectionTitle;
