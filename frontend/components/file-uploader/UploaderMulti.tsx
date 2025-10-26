// UploaderMulti.tsx
"use client"

import React, { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import {
    RenderEmptyState,
    RenderErrorState,
    RenderUploadedState,
    RenderUploadingState,
} from "@/components/file-uploader/RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
    FILE_MAX_FILE_SIZE,
    IMAGE_MAX_FILE_SIZE,
    NBR_MAX_FILE_RESOURCES_TO_UPLOAD,
    VIDEO_MAX_FILE_SIZE,
} from "@/constants/admin-contants";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {constructUrl} from "@/hooks/use-construct-url";
import {UploaderFileType} from "@/models";

interface UploaderState {
    id: string;
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
    value?: string | string[];
    onChange: (value: string | string[]) => void;
    fileTypeAccepted: UploaderFileType;
    multipleFiles?: boolean;
}

const sizeMap = {
    image: IMAGE_MAX_FILE_SIZE,
    video: VIDEO_MAX_FILE_SIZE,
    file: FILE_MAX_FILE_SIZE,
};

const acceptFileNbr = {
    image: 1,
    video: 1,
    file: NBR_MAX_FILE_RESOURCES_TO_UPLOAD,
};

const acceptMap: Record<UploaderFileType, Record<string, string[]>> = {
    image: { "image/*": [] },
    video: { "video/*": [] },
    file: {
        "application/pdf": [],
        "application/msword": [],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
        "application/vnd.ms-excel": [],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
        "application/zip": [],
        "text/plain": [],
        "image/*": [],
        "video/*": [],
    },
};

function inferFileTypeFromKey(key: string): UploaderFileType {
    if (key.match(/\.(jpg|jpeg|png|gif)$/)) return "image";
    if (key.match(/\.(mp4|webm|avi)$/)) return "video";
    return "file";
}

const UploaderMulti = ({ onChange, value, fileTypeAccepted, multipleFiles }: iAppProps) => {
    const multiple = multipleFiles || false;
    const [fileStates, setFileStates] = useState<UploaderState[]>([]);

    useEffect(() => {
        if (!value) return;

        const keys = Array.isArray(value) ? value : [value];

        const initialStates: UploaderState[] = keys.map((key) => ({
            id: key,
            file: null,
            uploading: false,
            progress: 100,
            key,
            isDeleting: false,
            error: false,
            objectUrl: constructUrl(key),
            fileType: inferFileTypeFromKey(key),
        }));

        setFileStates(initialStates);
    }, [value]);

    // Upload d'un fichier individuel
    const uploadFile = useCallback(
        async (file: File, id: string) => {

            setFileStates((prev) =>
                prev.map((f) => (f.id === id ? { ...f, uploading: true, progress: 0 } : f))
            );

            try {
                const presignedResponse = await fetch("/api/s3/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fileName: file.name,
                        contentType: file.type,
                        size: file.size,
                        isImage: fileTypeAccepted === "image",
                        isVideo: fileTypeAccepted === "video",
                    }),
                });

                if (!presignedResponse.ok) {
                    toast.error(presignedResponse.statusText + " , Failed to get presigned URL", {
                        style: {
                            background: "#FEE2E2",
                            color: "#991B1B",
                        },
                    });
                    setFileStates((prev) =>
                        prev.map((f) => (f.id === id ? { ...f, uploading: false,  progress: 0, error: true } : f))
                    );
                    return;
                }

                const { url, key } = await presignedResponse.json();

                await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percent = Math.round((event.loaded * 100) / event.total);
                            setFileStates((prev) =>
                                prev.map((f) => (f.id === id ? { ...f, progress: percent } : f))
                            );
                        }
                    };
                    xhr.onload = () => {
                        if (xhr.status === 200 || xhr.status === 204) {
                            setFileStates((prev) =>
                                prev.map((f) =>
                                    f.id === id ? { ...f, uploading: false, progress: 100, key } : f
                                )
                            );
                            toast.success("File uploaded successfully", {
                                style: {
                                    background: "#D1FAE5",
                                    color: "#065F46",
                                },
                            });
                            resolve(xhr.response);
                        } else {
                            setFileStates((prev) =>
                                prev.map((f) => (f.id === id ? { ...f, uploading: false,  progress: 0, error: true } : f))
                            );
                            reject(new Error("Failed to upload file"));
                        }
                    };
                    xhr.onerror = () =>{
                        setFileStates((prev) =>
                            prev.map((f) => (f.id === id ? { ...f, uploading: false,  progress: 0, error: true } : f))
                        );
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
                setFileStates((prev) =>
                    prev.map((f) => (f.id === id ? { ...f, uploading: false, error: true } : f))
                );
            }
        },
        [fileTypeAccepted]
    );

    // Drop handler
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newStates = acceptedFiles.map((file) => {
                const id = uuidv4();
                const objectUrl = URL.createObjectURL(file);
                const state: UploaderState = {
                    id,
                    file,
                    uploading: true,
                    progress: 0,
                    error: false,
                    isDeleting: false,
                    fileType: fileTypeAccepted,
                    objectUrl,
                };
                uploadFile(file, id);
                return state;
            });

            setFileStates((prev) => (multiple ? [...prev, ...newStates] : [...newStates]));

        },
        [multiple, uploadFile, fileTypeAccepted]
    );

    const handleRemoveFile = async (id: string) => {
        const file = fileStates.find((f) => {
            if(f.isDeleting || !f.objectUrl) return;

            if (f.id === id) {
                return f;
            }
            return null;
        });

        if (!file) return;

        setFileStates((prev) => prev.map((f) => (f.id === id ? { ...f, isDeleting: true } : f)));

        try {
            const response = await fetch(`/api/s3/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: file.key }),
            });

            if (!response.ok) {
                toast.error( response.statusText +  " , Failed to remove file from storage", {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });

               setFileStates((prev) => prev.map((f) => (f.id === id ? { ...f, isDeleting: false } : f)));
                return;
            }

            if (file.objectUrl && !file.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(file.objectUrl);
            }

            setFileStates((prev) => prev.filter((f) => f.id !== id));
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
            setFileStates((prev) => prev.map((f) => (f.id === id ? { ...f, isDeleting: false, error:true } : f)));
        }
    };

    const rejectFile = (fileRejection: FileRejection[]) => {
        fileRejection.forEach((rejection) => {
            rejection.errors.forEach((err) => {
                if (err.code === "file-too-large") {
                    toast.error("Fichier trop volumineux.");
                } else if (err.code === "file-invalid-type") {
                    toast.error("Type de fichier invalide.");
                } else if (err.code === "too-many-files") {
                    toast.error("Trop de fichiers sélectionnés.");
                }
            });
        });
    };

    const renderContent = () => {
        const maxReached = fileStates.length >= acceptFileNbr[fileTypeAccepted];

        if (fileStates.length === 0) {
            return <RenderEmptyState isDragActive={isDragActive} />;
        }

        if (multiple) {
            return (
                <div className="flex flex-col gap-4 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {fileStates.map((state) => {
                            if (state.uploading) {
                                return (
                                    <RenderUploadingState
                                        key={state.id}
                                        progress={state.progress}
                                        file={state.file as File}
                                    />
                                );
                            }
                            if (state.error) {
                                // N'affiche PAS RenderErrorState si multiple === true
                                if (!multiple) {
                                    return (
                                        <RenderErrorState
                                            key={state.id}
                                            error="Échec de l'upload du fichier"
                                        />
                                    );
                                }
                                return null;
                            }

                            if (state.objectUrl) {
                                return (
                                    <RenderUploadedState
                                        key={state.id}
                                        previewUrl={state.objectUrl}
                                        handleRemoveFile={() => handleRemoveFile(state.id)}
                                        isDeleting={state.isDeleting}
                                        fileType={state.fileType as UploaderFileType}
                                        file={state.key as string}
                                    />
                                );
                            }
                        })}
                    </div>

                    {!maxReached && (
                        <div className="mt-2 text-sm text-muted-foreground text-center">
                            <RenderEmptyState isDragActive={isDragActive} />
                        </div>
                    )}
                    {maxReached && (
                        <div className="mt-2 text-sm text-red-500 text-center">
                            Nombre maximal de fichiers atteint ({acceptFileNbr[fileTypeAccepted]})
                        </div>
                    )}
                </div>
            );
        }

        // Cas mono-fichier (image, video)
        const file = fileStates[0];
        if (file.uploading) {
            return <RenderUploadingState progress={file.progress} file={file.file as File} />;
        }

        if (file.error) {
            return <RenderErrorState error="Failed to upload file" />;
        }

        if (file.objectUrl) {
            return (
                <RenderUploadedState
                    previewUrl={file.objectUrl}
                    handleRemoveFile={() => handleRemoveFile(file.id)}
                    isDeleting={file.isDeleting}
                    fileType={file.fileType as UploaderFileType}
                    file={file.key as string}
                />
            );
        }

        return null;
    };

    useEffect(() => {
        return () => {
            fileStates.forEach((file) => {
                if (file.objectUrl && !file.objectUrl.startsWith("http")) {
                    URL.revokeObjectURL(file.objectUrl);
                }
            });
        };
    }, [fileStates]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptMap[fileTypeAccepted],
        maxFiles: acceptFileNbr[fileTypeAccepted],
        multiple,
        maxSize: sizeMap[fileTypeAccepted],
        onDropRejected: rejectFile,
        disabled: false,
    });

    return (
        <Card
            {...getRootProps()}
            className={cn(
                "relative border-dashed border-2 transition-colors duration-200 ease-in-out w-full min-h-64",
                isDragActive ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"
            )}
        >
            <input {...getInputProps()} />
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                {renderContent()}
            </CardContent>
        </Card>
    );
};

export default UploaderMulti;
