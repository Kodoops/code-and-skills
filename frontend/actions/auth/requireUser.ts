"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import { AxiosServerClient } from "@/lib/axiosServerClient";
import {UserProfile} from "@/models";
import {ApiResponse} from "@/lib/types";


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
        console.error("❌ requireUser: échec de vérification du token:", error.message);
        return null;
    }
});