// lib/theme.ts
export const theme = {
    colors: {
        // Branding
        orangeFrom: "#FFA000",
        orangeTo: "#FF6F00",
        blueFrom: "#0288D1",
        blueTo: "#01579B",
        gray900: "#0B0F14",

        white: "#FFFFFF",
        black: "#000000",
    },

    gradients: {
        // Dégradé orange (clair → foncé)
        orange: "linear-gradient(90deg, #FFA000, #FF6F00)",

        // Dégradé bleu (clair → foncé)
        blue: "linear-gradient(90deg, #0288D1, #01579B)",

        // Dégradé foncé (gris foncé → noir profond)
        dark: "linear-gradient(90deg, #0B0F14, #000000)",
    },
} as const;


export const colorClasses: Record<string, { bg: string; text: string }> = {
    primary: {bg: "bg-primary/10", text: "text-primary"},
    secondary: {bg: "bg-secondary/10", text: "text-secondary"},
    success: {bg: "bg-emerald-500/10", text: "text-emerald-600"},
    warning: {bg: "bg-amber-500/10", text: "text-amber-600"},
    destructive: {bg: "bg-destructive/10", text: "text-destructive"},
    muted: {bg: "bg-muted", text: "text-muted-foreground"},
    "muted-foreground": {bg: "bg-muted/10", text: "text-muted-foreground"},
    accent: {bg: "bg-accent/10", text: "text-accent-foreground"},
    orange: {bg: "bg-orange", text: "text-orange-foreground"}
};