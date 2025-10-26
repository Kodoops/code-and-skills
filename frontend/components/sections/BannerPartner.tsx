import React from 'react';
import {theme} from "@/lib/theme";
import {Card} from "@/components/ui/card";

interface Props {
    title: string;
    subTitle?: string;
    buttons?: React.ReactNode;
    children?: React.ReactNode;

}

const BannerPartner = ({ title, subTitle, buttons, children}:Props) => {
    return (
        <Card className="relative overflow-hidden rounded-3xl border border-white/10 p-6 ring-1 ring-white/10">
            <div className="absolute inset-0 opacity-70" style={{background: theme.gradients.orange}}/>
            <div className={`relative grid grid-cols-1 items-center gap-6 ${children ? 'md:grid-cols-2' : ' '}`}>
                <div className={`flex flex-col ${children?"items-start":"items-center"} justify-center`}>
                    <h3 className="flex-1 text-2xl font-bold">{title}</h3>
                    <p className="mt-2 text-sm text-white/95">{subTitle}</p>
                    <div className="mt-4 flex gap-3">
                        {buttons}
                    </div>
                </div>
                {children}
            </div>
        </Card>
    );
};

export default BannerPartner;
