import { AxiosError } from "axios";
import { TypeResponse } from "@/lib/types";

export function handleAxiosError<T>(
    error: unknown,
    defaultMessage = "Une erreur est survenue"
): TypeResponse<T> {
    if (error instanceof AxiosError) {
        // 🔹 Cas 1 : le backend a répondu avec une erreur structurée
        if (error.response) {
            const backendError = error.response.data;
            return {
                status: "error",
                message:
                    backendError?.message ||
                    backendError?.error ||
                    `${defaultMessage} (${error.response.status})`,
                data: null,
            };
        }

        // 🔹 Cas 2 : aucune réponse (timeout / réseau)
        if (error.request) {
            return {
                status: "error",
                message: "Aucune réponse du serveur. Vérifiez votre connexion.",
                data: null,
            };
        }
    }

    // 🔹 Cas 3 : erreur inattendue
   // console.error("❌ Erreur inconnue:", error);
    return {
        status: "error",
        message: defaultMessage,
        data: null,
    };
}