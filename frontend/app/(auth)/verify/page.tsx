"use client";

import React, { useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {verifyAccountAction} from "@/actions/auth/auth";

export default function VerifyAccountPage() {
    const params = useSearchParams();
    const token = params.get("token");
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!token) {
            toast.error("Lien de vérification invalide ou manquant.");
            return;
        }

        startTransition(async () => {
            const result = await verifyAccountAction(token);

            if (!result.success) {
                toast.error(result.message,{
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
                return;
            }

            toast.success(result.message,  {
                style: {
                    background: "#D1FAE5",
                    color: "#065F46",
                },
            });
            setTimeout(() => router.push("/login"), 1500);
        });
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2
                className={`h-6 w-6 ${
                    isPending ? "animate-spin text-blue-500" : "text-green-600"
                }`}
            />
            <p className="text-sm text-gray-600">
                {isPending
                    ? "Vérification de votre compte en cours..."
                    : "Redirection..."}
            </p>
        </div>
    );
}