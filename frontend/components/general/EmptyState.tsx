import { Ban, PlusCircle, LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface Props {
    title: string;
    description: string;
    buttonText?: string;
    href?: string;
    icon?: LucideIcon; // facultatif, avec valeur par défaut
}

const EmptyState = ({ title, description, buttonText, href, icon: Icon = PlusCircle }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center flex-1 h-full rounded-md border-dashed p-8 text-center animate-in fade-in-50">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
                <Ban className="size-10 text-primary" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">{title}</h2>
            <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground">{description}</p>
            {href && <Link href={href} className={buttonVariants()}>
                <Icon className="size-4 mr-2"/>
                {buttonText}
            </Link>}
        </div>
    );
};

export default EmptyState;
