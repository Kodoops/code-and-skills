import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/ui/theme-provider";
import {Toaster} from "@/components/ui/sonner";
import {SessionProvider} from "@/lib/context/SessionContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Code and Skills",
    description: "Learning Network Application ",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        >
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <div className="min-h-screen">
                    {children}
                </div>
                <Toaster closeButton position="bottom-center"/>
            </ThemeProvider>
        </SessionProvider>
        </body>
        </html>
    );
}
