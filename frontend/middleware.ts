// ✅ middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
    "/",
    "/login",
    "/signin",
    "/register",
    "/forgot-password",
    "/favicon.ico",
    "/_next", // assets Next.js
    "/api/public",
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ✅ Routes publiques
    const isPublic =
        PUBLIC_PATHS.includes(pathname) ||
        PUBLIC_PATHS.some((path) => pathname.startsWith(path) && path !== "/");

    if (isPublic) {
        return NextResponse.next();
    }

    // 🔒 Vérifie le token
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        console.warn("🚫 Aucun token trouvé, redirection vers /login");
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 🔍 Vérifie le profil
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        if (!res.ok) {
            console.warn("🚫 Token invalide ou expiré, redirection /login");
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const { data: user } = await res.json();
        const role = user?.role?.toUpperCase() ?? "USER";

        // 🧭 Règles d’accès
        if (pathname.startsWith("/admin") && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/not-admin", req.url));
        }

        if (pathname.startsWith("/instructor") && !["INSTRUCTOR", "ADMIN"].includes(role)) {
            return NextResponse.redirect(new URL("/not-authorized", req.url));
        }

        if (pathname.startsWith("/dashboard") && !["USER", "INSTRUCTOR", "ADMIN"].includes(role)) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        console.log("✅ Accès autorisé pour:", role);
        return NextResponse.next();
    } catch (error) {
        console.error("❌ Middleware error:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/instructor/:path*", "/admin/:path*"],
};