// app/not-found.tsx
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

export default function NotFound() {
    return (
           <div className="flex items-center justify-center mt-32">
               <Card className="h-full flex flex-col items-center justify-center p-6 ">
                   <h1 className="text-xl font-bold mb-4">404 : Not Found !</h1>
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
