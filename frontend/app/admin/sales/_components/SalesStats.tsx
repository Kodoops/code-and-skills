import React from 'react';
import {getPaymentsStatsAction} from "@/actions/admin/sales";

const SalesStats = async () => {
    const statsRes = await getPaymentsStatsAction();

    return (
        statsRes.status === "success" && statsRes.data && (
            <div className="grid gap-3 md:grid-cols-5">
                <div className="rounded-lg border bg-card p-3 text-xs">
                    <p className="text-muted-foreground">Total</p>
                    <p className="mt-1 text-lg font-semibold">
                        {(statsRes.data.grandTotal/100).toFixed(2)} €
                    </p>
                </div>
                <div className="rounded-lg border border-green-900 p-3 text-xs bg-green-100">
                    <p className="text-green-900">Total payé</p>
                    <p className="mt-1 text-lg font-semibold text-green-700">
                        {(statsRes.data.totalPaid/100).toFixed(2)} €
                    </p>
                </div>
                <div className="rounded-lg border bg-card p-3 text-xs">
                    <p className="text-muted-foreground">Total Remboursé</p>
                    <p className="mt-1 text-lg font-semibold">
                        {(statsRes.data.totalRefunded/100).toFixed(2)} €
                    </p>
                </div>
                <div className="rounded-lg border border-orange-900 bg-card p-3 text-xs bg-orange-100">
                    <p className="text-orange-700">Total en attente</p>
                    <p className="mt-1 text-lg font-semibold text-orange-500">
                        {(statsRes.data.totalPending/100).toFixed(2)} €
                    </p>
                </div>
                <div className="rounded-lg border border-red-900 bg-red-100 p-3 text-xs">
                    <p className="text-red-900">Total echoués</p>
                    <p className="mt-1 text-lg font-semibold text-red-700">
                        {(statsRes.data.totalFailed/100).toFixed(2)} €
                    </p>
                </div>

            </div>
        )
    );
};

export default SalesStats;