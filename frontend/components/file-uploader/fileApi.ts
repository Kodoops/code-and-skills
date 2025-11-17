"use server"

import {AxiosServerClient} from "@/lib/axiosServerClient";
import {TypeResponse} from "@/lib/types";
import {handleAxiosError} from "@/lib/handleAxiosError";

export interface ApiResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data: T;
    timestamp: string;
}

export interface PresignUploadPayload {
    fileName: string;
    folder: string;
    contentType: string;
    size: number;
    isImage: boolean;
    isVideo: boolean;
    fileType: string; // "GENERIC", "COURSE_THUMBNAIL", "AVATAR", etc.
}

export interface PresignUploadResponse {
    url: string;
    key: string;
    expiresInSeconds: number;
}

export interface FileUploadResponse {
    key: string;
    url: string;
    originalFileName: string;
    contentType: string;
    size: number;
}

export interface ConfirmUploadPayload {
    key: string;
    size: number;
    contentType: string;
    originalFileName: string;
}

export interface DeleteFilePayload {
    key: string;
}


export interface UploadFileParams {
    file: File;
    folder?: string;           // ex: "public/avatars" ou "private/uploads"
    fileType?: string;         // ex: "AVATAR", "COURSE_THUMBNAIL", "GENERIC"
    onProgress?: (pct: number) => void;
}

const FILE_SERVICE_BASE = "/files/user";

// 1️⃣ Appel à FILE_SERVICE_BASE/presign-upload
export async function apiPresignUpload(payload: PresignUploadPayload): Promise<TypeResponse<PresignUploadResponse>> {
    try{
        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<PresignUploadResponse>>(
            `${FILE_SERVICE_BASE}/presign-upload`,
            payload
        );

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de la réccupération de l'URL presignée  du fichier",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Url presignée confrimé avec succès",
            data: res.data.data,
        };

    } catch (error) {
    return handleAxiosError<PresignUploadResponse>(error, "Erreur de la réccupération de l'URL presignée  du fichier");
}
}

// 2️⃣ Upload file  vers S3 via l'URL présignée via backend
export async function apiUploadFile({
                                        file,
                                        folder = "uploads",
                                        fileType = "GENERIC",
                                        onProgress,
                                    }: UploadFileParams): Promise<TypeResponse<FileUploadResponse>> {

    try{

        const client = await AxiosServerClient();

        const formData = new FormData();
        formData.append("file", file);
        if (folder) {
            formData.append("folder", folder);
        }
        if (fileType) {
            formData.append("fileType", fileType);
        }

        const res = await client.post<ApiResponse<FileUploadResponse >>(
            `${FILE_SERVICE_BASE}/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (event) => {
                    if (event.total && onProgress) {
                        const pct = Math.round((event.loaded * 100) / event.total);
                        onProgress(pct);
                    }
                },
            }
        );


        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de l'upload du fichier",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Upload confrimé avec succès",
            data: res.data.data,
        };
    }catch (error) {
        return handleAxiosError<FileUploadResponse>(error, "Erreur de l'upload du fichier");
    }

}

// 3️⃣ Confirm upload côté backend
export async function apiConfirmUpload(payload: ConfirmUploadPayload): Promise<TypeResponse<null>> {
    try{

        const client = await AxiosServerClient();
        const res = await client.post<ApiResponse<void>>(
            `${FILE_SERVICE_BASE}/confirm-upload`,
            payload,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de la confirmation du upload du fichier",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "Upload confrimé avec succès",
            data: null,
        };

    } catch (error) {
        return handleAxiosError<null>(error, "Erreur de la confirmation du upload du fichier");
    }
}

// Delete File côté backend
export async function apiDeleteFile(payload: DeleteFilePayload): Promise<TypeResponse<null>> {

    try {

        const client = await AxiosServerClient();
        const res = await client.delete<ApiResponse<null>>(`${FILE_SERVICE_BASE}`, {
            data: payload,
            headers: {"Content-Type": "application/json"},
        });

        if (!res.data?.success || !res.data) {
            return {
                status: "error",
                message: res.data?.message || "Erreur de la suppression du fichier",
                data: null,
            };
        }

        return {
            status: "success",
            message: res.data.message || "fichier supprimé avec succès",
            data: null,
        };
    } catch (error) {
        return handleAxiosError<null>(error, "Erreur lors de la suppression du fichier");
    }

}