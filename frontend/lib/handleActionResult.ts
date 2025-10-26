"use client";

import { toast } from "sonner";
import {TypeResponse} from "@/lib/types";

/**
 * 🎯 Centralise la gestion des résultats d'une Server Action (succès / erreur)
 *
 * Exemple :
 *   const result = await adminCreateCourse(values);
 *   handleActionResult(result);
 *
 * Options :
 *   - silent: empêche l'affichage des toasts
 *   - onSuccess: callback optionnel exécuté si succès
 *   - onError: callback optionnel exécuté si erreur
 */
export function handleActionResult<T>(
    result: TypeResponse<T>,
    options?: {
        silent?: boolean;
        onSuccess?: (data: T | null) => void;
        onError?: (message: string) => void;
    }
) {
    const { silent = false, onSuccess, onError } = options || {};

    if (result.status === "error") {
        if (!silent) {
            toast.error(result.message, {
                style: {
                    background: "#FEE2E2",
                    color: "#991B1B",
                },
            });
        }

        if (onError) onError(result.message);
        return;
    }

    if (result.status === "success") {
        if (!silent) {
            toast.success(result.message, {
                style: {
                    background: "#D1FAE5",
                    color: "#065F46",
                },
            });
        }

        if (onSuccess) onSuccess(result.data ?? null);
    }
}


/*
🧩 Exemple d’utilisation dans une action front
Exemple : création de cours

async function handleSubmit(values: any) {
    const result = await adminCreateCourse(values);

    handleActionResult(result, {
        onSuccess: () => {
            console.log("✅ Cours créé !");
            router.push("/admin/courses");
        },
        onError: (message) => {
            console.warn("❌ Erreur:", message);
        },
    });
}
*/
