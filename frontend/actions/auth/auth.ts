"use server";

import { cookies } from "next/headers";
import { AxiosServerClient } from "@/lib/axiosServerClient";
import { SessionUser } from "@/models";
import { handleAxiosError } from "@/lib/handleAxiosError";
import {ApiResponse, TypeResponse} from "@/lib/types";

/**
 * ✅ Enregistrement (Register)
 */
export async function registerAction(formData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirm_password: string;
}): Promise<TypeResponse<null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.post("/auth/register", formData);

        return {
            status: "success",
            message:
                res.data?.data?.message ||
                res.data?.message ||
                "Inscription réussie. Vérifiez votre e-mail pour activer votre compte.",
            data: null,
        };
    } catch (error) {
        return handleAxiosError(error, "Erreur lors de l’inscription.");
    }
}

/**
 * ✅ Connexion (Login)
 */
export async function loginAction(credentials: {
    email: string;
    password: string;
}): Promise<TypeResponse<null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.post("/auth/login", credentials);

        const { accessToken, refreshToken } = res.data?.data || {};

        if (!accessToken) {
            throw new Error("Token non reçu depuis le serveur d’authentification.");
        }

        const cookieStore = await cookies();
        cookieStore.set("auth_token", accessToken);
        cookieStore.set("refresh_token", refreshToken);

        return {
            status: "success",
            message: res.data?.message || "Connexion réussie.",
            data: null,
        };
    } catch (error) {
        console.log(error)
        return handleAxiosError(error, "Échec de la connexion.");
    }
}

/**
 * ✅ Déconnexion (Logout)
 */
export async function logoutAction(): Promise<TypeResponse<null>> {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refresh_token")?.value;

        if (!refreshToken) {
            return {
                status: "error",
                message: "Aucun refresh token trouvé.",
                data: null,
            };
        }

        const client = await AxiosServerClient();
        await client.post("/auth/logout", { refreshToken });

        cookieStore.delete("auth_token");
        cookieStore.delete("refresh_token");

        return {
            status: "success",
            message: "Déconnexion réussie.",
            data: null,
        };
    } catch (error) {
        return handleAxiosError(error, "Erreur lors de la déconnexion.");
    }
}

/**
 * ✅ Vérification du compte (Email)
 */
export async function verifyAccountAction(token: string): Promise<TypeResponse<null>> {
    if (!token) {
        return {
            status: "error",
            message: "Token manquant.",
            data: null,
        };
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.get(`/auth/verify?token=${token}`);

        return {
            status: "success",
            message:
                res.data?.data?.message ||
                res.data?.message ||
                "Votre compte a bien été vérifié.",
            data: null,
        };
    } catch (error) {
        return handleAxiosError(error, "Erreur lors de la vérification du compte.");
    }
}

/**
 * 🔐 Session utilisateur (via cookie)
 */
export async function getUserSessionAction(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<SessionUser>>("/auth/profile");

        return res.data?.data ?? null;

    } catch (error:any) {
        if (error.sessionExpired) {
            const cookieStore = await cookies();
            cookieStore.delete("auth_token");
            cookieStore.delete("refresh_token");
        }
        return null;
        console.error("❌ getUserSessionAction:", error);
        return null;
    }
}

/**
 * ✅ Rafraîchissement du token
 */
export async function refreshTokenAction(): Promise<TypeResponse<{
    accessToken?: string;
    refreshToken?: string;
}>> {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refresh_token")?.value;

        if (!refreshToken) {
            return {
                status: "error",
                message: "Aucun refresh token trouvé.",
                data: null,
            };
        }

        const client = await AxiosServerClient();
        const res = await client.post("/auth/refresh", { refreshToken });

        const { accessToken, refreshToken: newRefreshToken } = res.data?.data || {};

        if (accessToken) cookieStore.set("auth_token", accessToken);
        if (newRefreshToken) cookieStore.set("refresh_token", newRefreshToken);

        return {
            status: "success",
            message: "Token rafraîchi avec succès.",
            data: { accessToken, refreshToken: newRefreshToken },
        };
    } catch (error) {
        return handleAxiosError(error, "Impossible de rafraîchir le token.");
    }
}

/**
 * 🚪 Déconnexion de toutes les sessions
 */
export async function logoutAllAction(): Promise<TypeResponse<null>> {
    try {
        const client = await AxiosServerClient();
        const res = await client.post("/auth/logout-all");

        const cookieStore = await cookies();
        cookieStore.delete("auth_token");
        cookieStore.delete("refresh_token");

        return {
            status: "success",
            message:
                res.data?.message ||
                "Toutes vos sessions ont été déconnectées avec succès.",
            data: null,
        };
    } catch (error) {
        return handleAxiosError(error, "Erreur lors de la déconnexion de toutes les sessions.");
    }
}