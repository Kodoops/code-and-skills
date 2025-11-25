// app/not-found.tsx
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {Ban} from "lucide-react";

export default function NotFound() {
    return (
           <div className="flex items-center justify-center mt-32">
               <Card className="h-full flex flex-col items-center justify-center p-6 ">
                   <h1 className="text-xl font-bold mb-4">Ooups, Page Introuvable !</h1>
                   <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
                       <Ban className="size-10 text-primary"/>
                   </div>
                   <p className="text-base mb-6">Oups, la page que vous cherchez n&apos;existe pas.</p>
                   <Link
                       href="/"
                       className={buttonVariants()}
                   >
                       Retour à l&apos;accueil
                   </Link>
               </Card>
           </div>
    );
}
