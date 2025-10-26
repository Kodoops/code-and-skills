"use client";

import { createContext, useContext } from "react";
import {useSession} from "@/hooks/useSession";

const SessionContext = createContext<ReturnType<typeof useSession> | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const session = useSession();
    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionContext() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSessionContext must be used inside SessionProvider");
    return ctx;
}