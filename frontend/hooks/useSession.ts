"use client";

import { useEffect, useState } from "react";
import {getUserSessionAction, logoutAction} from "@/actions/auth/auth";
import {getUserProfileAction} from "@/actions/auth/user";
import {UserProfile} from "@/models";
import {useRouter} from "next/navigation";

export function useSession() {
    const [user, setUser] = useState<UserProfile  | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;

        const fetchSession = async () => {
            try {
                const sessionData = await getUserSessionAction();
                if (!sessionData || cancelled) {
                    setUser(null);
                    return ;
                }

                const {data:profileData} = await getUserProfileAction();

                if (!profileData && !cancelled) {
                    setUser(null);
                    return ;
                }

                if (!cancelled ) {

                    setUser({...profileData, role: sessionData?.role ?? "USER"} as UserProfile);
                }

            } catch (error) {
                console.warn("❌ Session check failed:", error);
                if (!cancelled) {
                    setUser(null);
                   return null;
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchSession();
        return () => {
            cancelled = true;
        };
    }, []);

    const logout = async () => {
        try {
            const result = await logoutAction();
            if (result.status === "success") setUser(null);
            router.push("/");
        } catch (e) {
            console.error("Logout exception:", e);
        }
    };

    return { user, loading, authenticated: !!user,  logout };
}