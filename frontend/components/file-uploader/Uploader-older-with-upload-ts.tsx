// Uploader.tsx
"use client"

import React, {useCallback, useEffect, useState, useTransition} from 'react';
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
import {constructUrl, useConstructUrl} from "@/hooks/use-construct-url";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
//import {UploaderFileType} from "@/lib/types";


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

interface iAppProps {
    value?: string;
    onChange?: (value: string) => void;
    fileTypeAccepted: UploaderFileType;
    multipleFiles?: boolean;
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


const Uploader = ({onChange, value, fileTypeAccepted, multipleFiles}: iAppProps) => {
    const multiple = multipleFiles || false;

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
    // ✅ Nouveau : synchroniser quand `value` change (par ex. après form.reset)
    useEffect(() => {
        // nettoyage de l'ancien blob si on change d'URL
        setFileState(prev => {
            if (prev.objectUrl && !prev.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(prev.objectUrl);
            }

            // Si pas de value → on reset l’uploader
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

            // Si on a une value (URL ou key) → on met à jour l’aperçu
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


    const uploadFile = useCallback(
        async (file: File) => {
            setFileState((prev) => ({
                ...prev,
                uploading: true,
                progress: 0,
            }));

            try {
                const presignedResponse = await fetch("/api/s3/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fileName: file.name,
                        contentType: file.type,
                        size: file.size,
                        isImage: fileTypeAccepted === 'image',
                        isVideo: fileTypeAccepted === 'video',
                    }),
                });
                if (!presignedResponse.ok) {
                    toast.error("Failed to get presigned URL", {
                        style: {
                            background: "#FEE2E2",
                            color: "#991B1B",
                        },
                    });
                    setFileState((prev) => ({
                        ...prev,
                        uploading: false,
                        progress: 0,
                        error: true,
                    }));

                    return;
                }
                const {url, key} = await presignedResponse.json();

                await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percentageCompleted = Math.round((event.loaded * 100) / event.total);
                            setFileState((prev) => ({
                                ...prev,
                                progress: percentageCompleted,
                            }));
                        }
                    }
                    xhr.onload = () => {
                        if (xhr.status === 200 || xhr.status === 204) {
                            setFileState((prev) => ({
                                ...prev,
                                progress: 100,
                                uploading: false,
                                key: key,
                            }));
                            const link = constructUrl(key);
                            onChange?.(link ?? '');
                            toast.success("File uploaded successfully", {
                                style: {
                                    background: "#D1FAE5",
                                    color: "#065F46",
                                },
                            });
                            resolve(xhr.response);
                        } else {
                            setFileState((prev) => ({
                                ...prev,
                                uploading: false,
                                progress: 0,
                                error: true,
                            }));
                            reject(new Error("Failed to upload file"));
                        }
                    }

                    xhr.onerror = (e) => {
                        setFileState((prev) => ({
                            ...prev,
                            uploading: false,
                            progress: 0,
                            error: true,
                        }));
                        reject(new Error("Failed to upload file"));
                    }

                    xhr.open("PUT", url);
                    xhr.setRequestHeader("Content-Type", file.type);
                    xhr.send(file);
                });

            } catch (e) {
                console.log(e)
                toast.error("Failed to upload file", {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }));
            }
        }
        , [onChange, fileTypeAccepted]);


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

    async function handleRemoveFile() {
        if (fileState.isDeleting || !fileState.objectUrl) return;

        try {
            setFileState((prev) => ({
                ...prev,
                isDeleting: true,
            }));

            const response = await fetch(`/api/s3/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    key: fileState.key
                }),
            });

            if (!response.ok) {
                toast.error("Failed to remove file from storage", {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });

                setFileState((prev) => ({
                    ...prev,
                    isDeleting: true,
                    error: true,
                }));
                return;
            }

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
                style: {
                    background: "#D1FAE5",
                    color: "#065F46",
                },
            });
        } catch {
            toast.error("Failed to remove file from storage, please try again", {
                style: {
                    background: "#FEE2E2",
                    color: "#991B1B",
                },
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
                        style: {
                            background: "#FEE2E2",
                            color: "#991B1B",
                        },
                    })
                )
            }

            if (fileSizeTooBig) {
                return (
                    toast.error(`File size exceeded max size of ${fileTypeAccepted === 'image' ? IMAGE_MAX_FILE_SIZE / 1024 / 1024 : fileTypeAccepted === 'video' ? VIDEO_MAX_FILE_SIZE / 1024 / 1024 : FILE_MAX_FILE_SIZE / 1024 / 1024} MB`
                        , {
                            style: {
                                background: "#FEE2E2",
                                color: "#991B1B",
                            },
                        })
                )
            }

            if (fileNotValid) {
                toast.error(`Invalid file type. Only images are allowed.`, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                })
            }
        }

    }

    function renderContent() {
        if (fileState.uploading) {
            return (
                <RenderUploadingState progress={fileState.progress} file={fileState.file as File}/>
            )
        }

        if (fileState.error) {
            return (
                <RenderErrorState error={"Failed to upload file"}/>
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
