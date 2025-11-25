"use client";

import { useTransition, useState } from "react";
import {generateInvoiceForPaymentAction, refundPaymentAction} from "@/actions/admin/sales";
import {useRouter} from "next/navigation";

interface PaymentActionsProps {
    paymentId: string;
    userId:string;
    status: string;
}

export function PaymentActions({ paymentId , userId, status}: PaymentActionsProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    function handleGenerateInvoice() {
        startTransition(async () => {

            const res = await generateInvoiceForPaymentAction(paymentId, userId);

            setLoading(false);

            if (!res.ok) {
                // Tu peux remplacer par un toast
                alert(res.message);
                return;
            }

            // 1) Décoder la base64 en bytes
            const byteCharacters = atob(res.base64);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            // 2) Créer un Blob PDF
            const blob = new Blob([byteArray], { type: "application/pdf" });

            // 3) Créer une URL temporaire et simuler un clic
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = res.fileName || "invoice.pdf";
            document.body.appendChild(a);
            a.click();

            // 4) Nettoyage
            a.remove();
            window.URL.revokeObjectURL(url);
        })
    }


    const handleRefund = () => {
        setMessage(null);
        startTransition(async () => {
            const res = await refundPaymentAction(paymentId);
            if (res.status === "error") {
                setMessage(res.message);
                router.refresh();
                return;
            }

            setMessage(res.message || "Paiement remboursé avec succès.");
            // Tu peux déclencher un rafraîchissement de la page avec router.refresh() si besoin
        });
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={handleGenerateInvoice}
                    disabled={isPending}
                    className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? "Traitement..." : "Générer la facture"}
                </button>

                {status === 'PAID' && <button
                    type="button"
                    onClick={handleRefund}
                    disabled={isPending}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? "Traitement..." : "Rembourser le paiement"}
                </button>}
            </div>

            {message && (
                <p className="text-xs text-muted-foreground">
                    {message}
                </p>
            )}
        </div>
    );
}