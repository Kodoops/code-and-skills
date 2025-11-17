// Uploader.tsx
"use client"

import React, {useCallback, useEffect, useState} from 'react';
import {FileRejection, useDropzone} from "react-dropzone";
import {
    RenderEmptyState,
    RenderErrorState,
    RenderUploadedState,
    RenderUploadingState
} from "@/components/file-uploader/RenderState";
import {toast} from "sonner";
import {v4 as uuidv4} from 'uuid'
import {FILE_MAX_FILE_SIZE, IMAGE_MAX_FILE_SIZE, VIDEO_MAX_FILE_SIZE} from "@/constants/admin-contants";
import { useConstructUrl} from "@/hooks/use-construct-url";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import { apiDeleteFile, apiUploadFile} from "@/components/file-uploader/fileApi";

export type UploaderFileType = "image" | "video" | "file";

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType?: UploaderFileType;
}

interface UploaderProps {
    value?: string;
    onChange?: (value: string) => void;
    fileTypeAccepted: UploaderFileType;
    multipleFiles?: boolean;
    folder?: string;
    fileType?: string
}

const sizeMap = {
    image: IMAGE_MAX_FILE_SIZE,
    video: VIDEO_MAX_FILE_SIZE,
    file: FILE_MAX_FILE_SIZE,
};

const maxFiles = 5;

const acceptMap: Record<
    UploaderFileType,
    Record<string, string[]>
> = {
    image: {"image/*": []},
    video: {"video/*": []},
    file: {
        "application/pdf": [],
        "application/msword": [],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
        "application/vnd.ms-excel": [],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
        "application/zip": [],
        "text/plain": [],
        "image/*": [],
        "video/*": []
    },
};


const Uploader = (
    {onChange, value, fileTypeAccepted, multipleFiles, folder, fileType = "GENERIC"}
    : UploaderProps
) => {
    const multiple = multipleFiles ?? false;

    const fileUrl =  useConstructUrl(value || '');

    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        isDeleting: false,
        progress: 0,
        uploading: false,
        fileType: fileTypeAccepted,
        key: value,
        objectUrl: value ? fileUrl : undefined,
    });
    // 🔄 sync externe (ex: form.reset)
    useEffect(() => {
        setFileState(prev => {
            if (prev.objectUrl && !prev.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(prev.objectUrl);
            }

            if (!value) {
                return {
                    ...prev,
                    file: null,
                    key: undefined,
                    objectUrl: undefined,
                    uploading: false,
                    progress: 0,
                    error: false,
                    isDeleting: false,
                };
            }

            return {
                ...prev,
                key: value,
                objectUrl: fileUrl,
                file: null,
                uploading: false,
                progress: 0,
                error: false,
                isDeleting: false,
            };
        });
    }, [value, fileUrl]);

    // ✅ Nouvelle version : utilise  backend Spring
    // const uploadFile = useCallback(
    //     async (file: File) => {
    //         setFileState((prev) => ({
    //             ...prev,
    //             uploading: true,
    //             progress: 0,
    //         }));
    //
    //         try {
    //             const effectiveFolder = folder ?? "uploads";
    //             const effectiveFileType =
    //                 fileTypeAccepted === "image"
    //                     ? "IMAGE"
    //                     : fileTypeAccepted === "video"
    //                         ? "VIDEO"
    //                         : "FILE";
    //
    //
    //             // 1️⃣ Appel à /files/user/presign-upload
    //             const presign = await apiPresignUpload({
    //                 fileName: file.name,
    //                 folder: effectiveFolder,
    //                 contentType: file.type,
    //                 size: file.size,
    //                 isImage: fileTypeAccepted === "image",
    //                 isVideo: fileTypeAccepted === "video",
    //                 fileType: "GENERIC", // ou COURSE_THUMBNAIL, AVATAR...
    //             });
    //
    //            // const { url, key } = presign;
    //
    //             // 2️⃣ Upload direct vers S3 via l'URL présignée
    //             // await new Promise((resolve, reject) => {
    //             //     const xhr = new XMLHttpRequest();
    //             //
    //             //     xhr.upload.onprogress = (event) => {
    //             //         if (event.lengthComputable) {
    //             //             const percentageCompleted = Math.round((event.loaded * 100) / event.total);
    //             //             setFileState((prev) => ({
    //             //                 ...prev,
    //             //                 progress: percentageCompleted,
    //             //             }));
    //             //         }
    //             //     }
    //             //
    //             //     xhr.onload = () => {
    //             //         if (xhr.status === 200 || xhr.status === 204) {
    //             //             resolve(xhr.response);
    //             //         } else {
    //             //             setFileState((prev) => ({
    //             //                 ...prev,
    //             //                 uploading: false,
    //             //                 progress: 0,
    //             //                 error: true,
    //             //             }));
    //             //
    //             //             reject(new Error("Onload: Failed to upload file"));
    //             //         }
    //             //     }
    //             //
    //             //     xhr.onerror = (e) => {
    //             //         setFileState((prev) => ({
    //             //             ...prev,
    //             //             uploading: false,
    //             //             progress: 0,
    //             //             error: true,
    //             //         }));
    //             //
    //             //         reject(new Error("Error: Failed to upload file"));
    //             //     }
    //             //
    //             //     xhr.open("PUT", url);
    //             //     xhr.setRequestHeader("Content-Type", file.type);
    //             //     xhr.send(file);
    //             // });
    //
    //             const uploaded = await apiUploadFile({
    //                 file,
    //                 folder: effectiveFolder,
    //                 fileType: file.type, //effectiveFileType,
    //                 onProgress: (pct) => {
    //                     setFileState((prev) => ({
    //                         ...prev,
    //                         progress: pct,
    //                     }));
    //                 },
    //             });
    //
    //             const key = uploaded.key;
    //
    //             // 3️⃣ Confirm upload côté backend
    //             await apiConfirmUpload({
    //                 key,
    //                 size: file.size,
    //                 contentType: file.type,
    //                 originalFileName: file.name,
    //             });
    //
    //             // 4️⃣ OK → on met à jour l'état & on remonte la valeur
    //             setFileState((prev) => ({
    //                 ...prev,
    //                 progress: 100,
    //                 uploading: false,
    //                 key,
    //                 objectUrl: link, // permet l'aperçu
    //             }));
    //
    //             const link = constructUrl(key);
    //             onChange?.(link ?? "");
    //
    //             toast.success("File uploaded successfully", {
    //                 style: {background: "#D1FAE5", color: "#065F46"},
    //             });
    //
    //         } catch (e) {
    //             console.log(e)
    //             toast.error(" Failed to upload file", {
    //                 style: {background: "#FEE2E2", color: "#991B1B"},
    //             });
    //             setFileState((prev) => ({
    //                 ...prev,
    //                 uploading: false,
    //                 progress: 0,
    //                 error: true,
    //             }));
    //         }
    //     }
    //     , [onChange, fileTypeAccepted]
    // );

    // 👉 upload = un seul appel backend qui fait TOUT (S3 + DB)
    const uploadFile = useCallback(
        async (file: File) => {
            setFileState((prev) => ({
                ...prev,
                uploading: true,
                progress: 0,
            }));

            try {
                const uploaded = await apiUploadFile({
                    file,
                    folder: folder ?? "public/uploads", // tu choisis "public/..." ou "private/..."
                    fileType,
                    onProgress: (pct) => {
                        setFileState((prev) => ({ ...prev, progress: pct }));
                    },
                });

                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 100,
                    key: uploaded.data?.key,
                }));

                // 🔥 Tu peux décider ici si tu stockes la key ou l’url
                onChange?.(uploaded.data?.key!);

                toast.success("File uploaded successfully", {
                    style: { background: "#D1FAE5", color: "#065F46" },
                });
            } catch (e) {
                console.error(e);
                toast.error("Failed to upload file", {
                    style: { background: "#FEE2E2", color: "#991B1B" },
                });
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }));
            }
        },
        [onChange, folder, fileType]
    );

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }

            setFileState({
                file: file,
                uploading: true,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: fileTypeAccepted,
            });

            uploadFile(file);
        }
    }, [fileState.objectUrl, uploadFile, fileTypeAccepted]);

    // ✅ suppression : utilise DELETE
    async function handleRemoveFile() {
        if (fileState.isDeleting || !fileState.objectUrl) return;

        try {
            setFileState((prev) => ({
                ...prev,
                isDeleting: true,
            }));

            // Delete File côté backend
            await apiDeleteFile({
                key: fileState.key as string,
            });

            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }

            onChange?.("");

            setFileState(() => ({
                file: null,
                uploading: false,
                progress: 0,
                isDeleting: false,
                objectUrl: undefined,
                id: null,
                error: false,
                fileType: fileTypeAccepted,
            }));
            toast.success("File removed successfully", {
                style: {background: "#D1FAE5", color: "#065F46"},
            });
        } catch(e:any) {
            toast.error("Failed to remove file, please try again", {
                style: {background: "#FEE2E2", color: "#991B1B"},
            });
            setFileState((prev) => ({
                ...prev,
                isDeleting: false,
                error: true,
            }));
        }
    }

    function rejectFile(fileRejection: FileRejection[]) {
        if (fileRejection.length > 0) {
            const tooManyFiles = fileRejection.find(
                file => file.errors.length > 0 && file.errors[0].code === "too-many-files");
            const fileSizeTooBig = fileRejection.find(
                file => file.errors.length > 0 && file.errors[0].code === "file-too-large"
            )
            const fileNotValid = fileRejection.find(
                file => file.errors.length > 0 && file.errors[0].code === "file-invalid-type"
            )

            if (tooManyFiles) {
                return (
                    toast.error("Too many files selected, max is one file.", {
                        style: {background: "#FEE2E2", color: "#991B1B",},
                    })
                )
            }

            const maxMb =
                fileTypeAccepted === "image"
                    ? IMAGE_MAX_FILE_SIZE / 1024 / 1024
                    : fileTypeAccepted === "video"
                        ? VIDEO_MAX_FILE_SIZE / 1024 / 1024
                        : FILE_MAX_FILE_SIZE / 1024 / 1024;

            if (fileSizeTooBig) {
                return (
                    toast.error(
                        `File size exceeded max size of ${maxMb} MB`,
                        {
                            style: {background: "#FEE2E2", color: "#991B1B",},
                        })
                )
            }

            if (fileNotValid) {
                toast.error(`Invalid file type.`, {
                    style: {background: "#FEE2E2", color: "#991B1B",},
                })
            }
        }
    }

    function renderContent() {
        if (fileState.uploading) {
            return (
                <RenderUploadingState
                    progress={fileState.progress}
                    file={fileState.file as File}
                />
            )
        }

        if (fileState.error) {
            return (
                <RenderErrorState
                    error={"Failed to upload file"}
                />
            )
        }

        if (fileState.objectUrl) {
            return (
                <RenderUploadedState
                    previewUrl={fileState.objectUrl}
                    handleRemoveFile={handleRemoveFile}
                    isDeleting={fileState.isDeleting}
                    fileType={fileState.fileType as UploaderFileType}
                    file={fileState.key as string}
                />
            )
        }

        return <RenderEmptyState isDragActive={isDragActive}/>
    }

    useEffect(() => {
        return () => {
            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }
        }
    }, [fileState.objectUrl])

    const {getRootProps, getInputProps, isDragActive} = useDropzone(
        {
            onDrop,
            accept: fileTypeAccepted ? acceptMap[fileTypeAccepted] : undefined,
            maxFiles: multiple ? maxFiles : 1,
            multiple: multiple,
            maxSize: fileTypeAccepted ? sizeMap[fileTypeAccepted] : FILE_MAX_FILE_SIZE,
            onDropRejected: rejectFile,
            disabled: fileState.uploading || !!fileState.objectUrl,
        }
    )

    return (
        <Card {...getRootProps()}
              className={cn("relative border-dashed border-2 transition-colors duration-200 ease-in-out w-full min-h-64",
                  isDragActive ? 'border-primary bg-primary/10 border-solid' : 'border-border hover:border-primary'
              )}>
            <input {...getInputProps()} />
            <CardContent className={"flex items-center justify-center h-full w-full p-4 "}>
                {renderContent()}
            </CardContent>
        </Card>
    )
};

export default Uploader;
