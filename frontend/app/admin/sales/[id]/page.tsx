import Link from "next/link";
import { notFound } from "next/navigation";
import {getPaymentByIdAction} from "@/actions/admin/sales";
import {PaymentActions} from "@/app/admin/sales/[id]/_component/PaymentActions";

export default async function PaymentDetailPage({
                                                    params,
                                                }: {
    params: { id: string };
}) {
    const paymentId = params.id;

    const res = await getPaymentByIdAction(paymentId);

    if (res.status === "error" || !res.data) {
        // Tu peux faire une page d'erreur plus propre si tu veux
        notFound();
    }

    const p = res.data;

    const getStatusClasses = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
            case "PENDING":
                return "bg-amber-50 text-amber-700 ring-amber-600/20";
            case "FAILED":
                return "bg-rose-50 text-rose-700 ring-rose-600/20";
            default:
                return "bg-gray-50 text-gray-700 ring-gray-500/20";
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header + retour */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Détail du paiement
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Visualisation des informations du paiement et actions disponibles.
                    </p>
                </div>
                <Link
                    href="/admin/sales"
                    className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted"
                >
                    ← Retour à la liste
                </Link>
            </div>

            {/* Carte principale */}
            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
                {/* Infos paiement */}
                <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Paiement #{p.id}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Créé le{" "}
                                {p.createdAt
                                    ? new Date(p.createdAt).toLocaleString("fr-FR")
                                    : "-"}
                            </p>
                        </div>
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${getStatusClasses(
                                p.status
                            )}`}
                        >
              {p.status === "PAID"
                  ? "Payé"
                  : p.status === "PENDING"
                      ? "En attente"
                      : p.status === "FAILED"
                          ? "Échoué"
                          : p.status}
            </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                Utilisateur
                            </p>
                            <p className="text-sm font-medium text-foreground">
                                {p.userId}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                Référence (course / abonnement)
                            </p>
                            <p className="text-sm text-foreground">{p.referenceId}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                Type
                            </p>
                            <p className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                                {p.type}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                Montant
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                                {(p.amount as unknown as number/100).toFixed(2)}{" "}
                                <span className="text-xs text-muted-foreground">
                  {p.currency}
                </span>
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                Méthode
                            </p>
                            <p className="text-sm text-foreground">
                                {p.method || "-"}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                Stripe Session
                            </p>
                            <p className="text-xs font-mono text-foreground/80">
                                {p.stripeId || "-"}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                Stripe Payment Intent
                            </p>
                            <p className="text-xs font-mono text-foreground/80">
                                {p.stripePaymentIntentId || "-"}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                Reçu Stripe
                            </p>
                            {p.receiptUrl ? (
                                <a
                                    href={p.receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium text-primary hover:underline"
                                >
                                    Voir le reçu
                                </a>
                            ) : (
                                <p className="text-xs text-muted-foreground">-</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-foreground">
                        Actions sur le paiement
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Tu peux générer une facture pour ce paiement ( ou remboursement ) ou lancer un
                        remboursement (via Stripe).
                    </p>

                    <PaymentActions paymentId={p.id} userId={p.userId} status={p.status} />
                </div>
            </div>
        </div>
    );
};