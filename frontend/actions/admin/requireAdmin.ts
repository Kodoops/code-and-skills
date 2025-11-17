"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { AxiosServerClient } from "@/lib/axiosServerClient";
import { SessionUser} from "@/models";
import {ApiResponse} from "@/lib/types";


/**
 * 🔐 Vérifie que l’utilisateur est authentifié et ADMIN
 */
export const requireAdmin = cache(async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return redirect("/login");
    }

    try {
        const client = await AxiosServerClient();
        const res = await client.get<ApiResponse<SessionUser>>("/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data?.data;

        if (!user) {
            console.warn("⚠️ Aucun utilisateur trouvé");
            return redirect("/login");
        }

        // 🚫 Si pas admin
        if (user?.role?.toUpperCase() !== "ADMIN") {
            return redirect("/not-admin");
        }

        // ✅ OK → renvoie la session utilisateur
        return user;
    } catch (error: any) {
        console.error("❌ requireAdmin: échec de vérification du token:", error.message);
        return redirect("/login");
    }
});