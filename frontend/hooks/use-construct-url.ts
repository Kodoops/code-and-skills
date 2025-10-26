import {env} from "@/lib/env";

export function useConstructUrl(key: string) :  string {

    if (key.startsWith("http")) return key; // ✅ Déjà une URL complète
    return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${key}`;
}

// lib/utils/url.ts
export function constructUrl(key?: string): string | undefined {

    if (!key) return undefined;
    if (key.startsWith("http")) return key; // ✅ Déjà une URL complète
    return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${key}`;
}
