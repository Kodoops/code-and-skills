import Link from "next/link";
import {getPaymentsAction} from "@/actions/admin/sales";
import {EyeIcon} from "lucide-react";
import SalesStats from "@/app/admin/sales/_components/SalesStats";

export default async function SalesPage({
                                               searchParams,
                                           }: {
    searchParams: {
        page?: string;
        userId?: string;
        type?: string;
        status?: string;
    };
}) {
    const params = await searchParams;
    const page = Number(params.page ?? 0);

    const userIdFilter = params.userId ?? "";
    const typeFilter = params.type ?? "";
    const statusFilter = params.status ?? "";

    const res = await getPaymentsAction({
        page,
        size: 10,
        userId: userIdFilter,
        type: typeFilter,
        status: statusFilter,
    });

    if (res.status === "error" || !res.data) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-2 tracking-tight">
                    Paiements
                </h1>
                <p className="text-red-600 text-sm">{res.message}</p>
            </div>
        );
    }

    const { content, totalPages } = res.data;

    const getStatusClasses = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
            case "PENDING":
                return "bg-amber-50 text-amber-700 ring-amber-600/20";
            case "FAILED":
                return "bg-rose-50 text-rose-700 ring-rose-600/20";
            case "REFUNDED":
                return "bg-red-50 text-red-700 ring-red-600/20";
            default:
                return "bg-gray-50 text-gray-700 ring-gray-500/20";
        }
    };

    // 🔗 Helper pour générer des URLs de pagination SANS passer d’objet complexe
    const buildPageHref = (targetPage: number) => {
        const params = new URLSearchParams();

        if (userIdFilter) params.set("userId", userIdFilter);
        if (typeFilter) params.set("type", typeFilter);
        if (statusFilter) params.set("status", statusFilter);

        params.set("page", targetPage.toString());

        const qs = params.toString();
        return qs ? `/admin/sales?${qs}` : "/admin/sales";
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Paiements / Ventes / Abonnements</h1>
                <p className="text-sm text-muted-foreground">
                    Liste des paiements avec filtres et actions.
                </p>
            </div>
            {/* Stats  */}
            <SalesStats />

            {/* Filtres */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
                <form className="flex flex-wrap items-end gap-4" method="get">
                    {/* Filtre userId */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="userId"
                            className="text-xs font-medium text-muted-foreground"
                        >
                            Utilisateur (userId)
                        </label>
                        <input
                            id="userId"
                            name="userId"
                            type="text"
                            defaultValue={userIdFilter}
                            className="h-9 w-56 rounded-md border bg-background px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="ID utilisateur"
                        />
                    </div>

                    {/* Filtre Type */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="type"
                            className="text-xs font-medium text-muted-foreground"
                        >
                            Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            defaultValue={typeFilter}
                            className="h-9 w-40 rounded-md border bg-background px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">Tous</option>
                            <option value="COURSE">COURSE</option>
                            <option value="SUBSCRIPTION">SUBSCRIPTION</option>
                            {/* ajoute d'autres types si besoin */}
                        </select>
                    </div>

                    {/* Filtre Status */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="status"
                            className="text-xs font-medium text-muted-foreground"
                        >
                            Statut
                        </label>
                        <select
                            id="status"
                            name="status"
                            defaultValue={statusFilter}
                            className="h-9 w-40 rounded-md border bg-background px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">Tous</option>
                            <option value="PAID">PAID</option>
                            <option value="PENDING">PENDING</option>
                            <option value="REFUNDED">REFUNDED</option>
                            <option value="FAILED">FAILED</option>
                        </select>
                    </div>

                    {/* Quand on change les filtres, on revient à la page 0 */}
                    <input type="hidden" name="page" value="0" />

                    {/* Boutons */}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
                        >
                            Filtrer
                        </button>

                        <Link
                            href="/admin/sales"
                            className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium text-foreground shadow-sm hover:bg-muted"
                        >
                            Réinitialiser
                        </Link>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-muted/60">
                    <tr>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Réf.
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Utilisateur
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Type
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Montant
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Statut
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Méthode
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Créé le
                        </th>
                        <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                    {content.length === 0 && (
                        <tr>
                            <td
                                colSpan={8}
                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                            >
                                Aucun paiement trouvé avec ces filtres.
                            </td>
                        </tr>
                    )}

                    {content.map((p) => (
                        <tr key={p.id} className="hover:bg-muted/40">
                            <td className="px-4 py-3 align-middle font-mono text-[13px] text-foreground/90">
                                {p.id}
                            </td>
                            <td className="px-4 py-3 align-middle text-foreground/80">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{p.userId}</span>
                                    {p.referenceId && (
                                        <span className="text-[11px] text-muted-foreground">
                        Ref: {p.referenceId}
                      </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 align-middle text-xs text-muted-foreground">
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                    {p.type}
                  </span>
                            </td>
                            <td className="px-4 py-3 align-middle text-sm font-medium text-foreground">
                                {(p.amount as unknown as number/100).toFixed(2)}{" "}
                                <span className="text-xs text-muted-foreground">
                    {p.currency}
                  </span>
                            </td>
                            <td className="px-4 py-3 align-middle">
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
                                : p.status === "REFUNDED"
                                    ? "Remboursé"
                                    : p.status
                    }
                  </span>
                            </td>
                            <td className="px-4 py-3 align-middle text-xs text-muted-foreground">
                                {p.method || "-"}
                            </td>
                            <td className="px-4 py-3 align-middle text-xs text-muted-foreground">
                                {p.createdAt
                                    ? new Date(p.createdAt).toLocaleString("fr-FR")
                                    : "-"}
                            </td>
                            <td className="px-4 py-3 align-middle text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    <Link
                                        href={`/admin/sales/${p.id}`}
                                        className="inline-flex items-center rounded-md border gap-2 px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted"
                                    >
                                       <EyeIcon className={"size-4 "}/> Voir
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Page <span className="font-semibold">{page + 1}</span> /{" "}
            <span className="font-semibold">{Math.max(totalPages, 1)}</span>
        </span>
                <div className="flex gap-2">
                    <Link
                        href={buildPageHref(Math.max(page - 1, 0))}
                        className={`inline-flex items-center rounded-md border px-2.5 py-1 ${
                            page <= 0
                                ? "pointer-events-none opacity-40"
                                : "hover:bg-muted text-foreground"
                        }`}
                    >
                        Précédent
                    </Link>
                    <Link
                        href={buildPageHref(
                            res.data.totalPages === 0
                                ? 0
                                : Math.min(page + 1, res.data.totalPages - 1)
                        )}
                        className={`inline-flex items-center rounded-md border px-2.5 py-1 ${
                            page >= totalPages - 1 || totalPages === 0
                                ? "pointer-events-none opacity-40"
                                : "hover:bg-muted text-foreground"
                        }`}
                    >
                        Suivant
                    </Link>
                </div>
            </div>
        </div>
    );
}