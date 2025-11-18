"use client";

import axios from "axios";

export interface ApiResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data: T;
    timestamp: string;
}

export interface FileUploadResponse {
    key: string;
    url: string;
    originalFileName: string;
    contentType: string;
    size: number;
}

export interface UploadFileParams {
    file: File;
    folder?: string;      // ex: "public/avatars"
    fileType?: string;    // ex: "AVATAR", "VIDEO", "GENERIC"
    onProgress?: (pct: number) => void;
}

export interface DeleteFilePayload {
    key: string;
}

// URL de base de ton backend (gateway/file-service)
const API_BASE_URL =process.env.NEXT_PUBLIC_AUTH_API_URL

// 1️⃣ Upload côté client avec onUploadProgress
export async function apiUploadFileClient({
                                              file,
                                              folder = "public/uploads",
                                              fileType = "GENERIC",
                                              onProgress,
                                          }: UploadFileParams): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);
    formData.append("folder", folder);

    const url = `${API_BASE_URL}/files/user/upload`;

    const res = await axios.post<ApiResponse<FileUploadResponse>>(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // si tu utilises des cookies pour le JWT
        onUploadProgress: (event) => {
            if (event.total && onProgress) {
                const pct = Math.round((event.loaded * 100) / event.total);
                onProgress(pct);         // ✅ ici → côté client donc OK
            }
        },
    });

    if (!res.data?.success || !res.data.data) {
        throw new Error(res.data?.message ?? "Upload failed");
    }

    return res.data.data;
}

// 2️⃣ Suppression côté client
export async function apiDeleteFileClient(payload: DeleteFilePayload): Promise<void> {
    const url = `${API_BASE_URL}/files/user`;

    await axios.delete<ApiResponse<null>>(url, {
        data: payload,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });
}