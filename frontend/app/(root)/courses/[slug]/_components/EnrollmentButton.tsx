"use client"

import { Button } from '@/components/ui/button';
import React, { useTransition } from 'react';
import {toast} from "sonner";
import {Loader2} from "lucide-react";
import {ensureStripeCustomer, startCourseCheckout} from "@/actions/auth/billing";
import {useSession} from "@/hooks/useSession";
import {useRouter} from "next/navigation";

export function EnrollmentButton  ({courseId, btnLabel, btnVariant, price, courseTitle}:
                                   {courseId:string, btnLabel:string, price: number, courseTitle: string,
    btnVariant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined }) {

    const [pending, startTransition] = useTransition();
    const {user} = useSession();
    const router = useRouter();

    function onSubmit() {
        startTransition(async () => {
            if(!user) {
                router.push("/login");
                return;
            }
            // 1) s'assurer d’avoir un stripeCustomerId
            const sc = await ensureStripeCustomer(user?.userId as string);
            if (sc.status === "error" || !sc.data?.stripeCustomerId) {
                toast.error(sc.message);
                return;
            }
            // 2) créer la session checkout
            const resp = await startCourseCheckout({
                userId : user?.id as string,
                email: user?.email as string,
                courseId,
                courseTitle: courseTitle,
                stripeCustomerId: sc.data.stripeCustomerId,
                amount:price, // ex 19900 (centimes)
                currency: "eur",
            });

            if (resp.status === "success" && resp.data?.checkoutUrl) {
                window.location.href = resp.data.checkoutUrl;
            } else {
                toast.error(resp.message || "Erreur de paiement");
            }
        });
    }

    return (
        <Button className={"w-full"} onClick={onSubmit}  disabled={pending} variant={btnVariant}>
            {pending ? <>
            <Loader2 className={"size-4 animate-spin"}/>
                Loading ...
            </> : btnLabel}
        </Button>
    );
};

