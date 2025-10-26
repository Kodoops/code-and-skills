
export type PaginationResponse<T> = {data:T [], total:number, page: number, perPage: number, totalPages:number}

/**
 * 🧩 Type générique pour les réponses standardisées des actions ou API
 * T = type de la donnée (par exemple Course, User, etc.)
 */
export type TypeResponse<T> =
    | {
    status: "success";
    message: string;
    data: T;
}
    | {
    status: "error";
    message: string;
    data: null | T;
};

/**
 * 🔹 Modèle de réponse paginée conforme au backend
 */
export interface PagedResponse<T> {
    content: T[];
    currentPage: number;
    totalPages: number;
    perPage: number;
    totalElements: number;
}

/**
 * 🔹 Structure complète de la réponse backend
 */
export interface ApiResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data: T;
    timestamp: string;
}

/**
 * 🔹 Structure d'erreur renvoyée par les microservices
 */
export interface ApiError {
    path: string;
    correlationId?: string;
    error: string;
    message: string;
    timestamp: string;
    status: number;
}



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

export const listColors = Object.keys(colorClasses);

export const iconLibs = ["lucide", "si", "fa", "tabler"];

export const levelBgColors: Record<string, string> = {
    Beginner: "bg-green-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-red-500",
    Expert: "bg-purple-500",
}

export const levels = [
    {label: "Tous les niveaux", value: "all"},
    {label: "Débutant", value: "Beginner"},
    {label: "Intermédiaire", value: "Intermediate"},
    {label: "Avancé", value: "Advanced"},
    {label: "Expert", value: "Expert"},
];

export type UploaderFileType = "image" | "video" | "file";