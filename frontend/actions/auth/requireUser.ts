"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import { AxiosServerClient } from "@/lib/axiosServerClient";
import {UserProfile} from "@/models";
import {ApiResponse} from "@/lib/types";
import axios from "axios";


/**
 * 🔐 Vérifie que l’utilisateur est authentifié et ADMIN
 */
export const requireUser = cache(async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return null ;
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<UserProfile>>("/profiles/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data?.data;

        if (!user) {
            console.warn("⚠️ Aucun utilisateur trouvé");
            return null;
        }

        // ✅ OK → renvoie la session utilisateur
        return user;
    } catch (error: any) {
// 🔍 Cas 1 : erreur HTTP Axios
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 401) {
                // Token expiré / invalide → on nettoie les cookies si tu veux
                // const cookieStore = await cookies();
                // cookieStore.delete("auth_token");
                // cookieStore.delete("refresh_token");

                console.warn("🔑 requireUser: token expiré ou invalide → user déconnecté.");
                return null;
            }
            console.log(error.response?.data || error.message);
            // console.error(
            //     `❌ requireUser: erreur HTTP ${status} `,
            //     error.response?.data || error.message
            // );
            return null;
        }

        // 🔍 Cas 2 : autre erreur (réseau, bug, etc.)
        console.error("❌ requireUser: erreur inattendue:", error);
        return null;
    }
});