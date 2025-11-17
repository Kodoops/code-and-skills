"use client";

import React, { useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {confirmNewsletterSubscription} from "@/actions/newsletter";
import {handleActionResult} from "@/lib/handleActionResult";

export default function ConfirmNewsLetterSubscriptionPage() {
    const params = useSearchParams();
    const email = params.get("email");
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!email) {
            toast.error("Lien de vérification invalide ou manquant.");
            return;
        }

        startTransition(async () => {
            const result = await confirmNewsletterSubscription(email);

            handleActionResult(result, {
                onSuccess: () => {
                    console.log("✅ Newsletter subscription confirmed !");
                    setTimeout(() => router.push("/login"), 1500);
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });

        });
    }, [email]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2
                className={`h-6 w-6 ${
                    isPending ? "animate-spin text-blue-500" : "text-green-600"
                }`}
            />
            <p className="text-sm text-gray-600">
                {isPending
                    ? "La confirmation de votre inscription a al newsletter est en cours..."
                    : "Redirection..."}
            </p>
        </div>
    );
}