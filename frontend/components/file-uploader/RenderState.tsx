import React from 'react';
import {CloudUploadIcon, ImageIcon, Loader2, XIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import FileSVG from '../custom-ui/FileSVG';


export function RenderEmptyState({isDragActive}: { isDragActive: boolean }) {
    return (
        <div className={"text-center"}>
            <div className="flex items-center justify-center size-12 mx-auto rounded-full bg-muted mb-4">
                <CloudUploadIcon className={cn("size-6 text-muted-foreground", isDragActive && "text-primary")}/>
            </div>
            <p className={"text-base font-semibold text-foreground"}>
                Drop your files here or <span className={"text-primary font-bold cursor-pointer"}>Click to upload</span>
            </p>
            <Button className={"mt-4"} type={"button"}>
                Select Files
            </Button>
        </div>
    );
};

export function RenderErrorState({error, onRetry}: { error: string ,  onRetry?: () => void}) {

    return (
        <div className={"text-center "}>
            <div className="flex items-center justify-center size-12 mx-auto rounded-full bg-destructive/30 mb-4">
                <ImageIcon className={cn("size-6 text-destructive")}/>
            </div>
            <p className={"text-base font-semibold "}>
                Upload failed!
            </p>
            <p className="text-xs mt-1 text-muted-foreground">
                Something wen wrong ...
            </p>
            <p className="text-xl mt-3 text-muted-foreground">
                Click or drag file to retry upload
            </p>
            <Button className={"mt-4"} type={"button"}  onClick={onRetry}>
                Retry File Selection
            </Button>
        </div>
    )
}

export function RenderUploadedState({previewUrl, isDeleting, handleRemoveFile, fileType, file}:
                                    {
                                        previewUrl: string, isDeleting: boolean, handleRemoveFile: () => void,
                                        fileType: string,
                                        file : string
                                    }) {

    return <div className={"relative group w-full h-full flex items-center justify-center"}>
        {
            fileType === 'image' &&
            <Image src={previewUrl} alt={"File Uploaded"} className={"object-contain p-2"} width={400}
                   height={200}/>}
        {fileType === 'video' &&
            <video src={previewUrl} controls className={"object-contain p-2 w-full h-full"} width={400} height={200}/>}

        {fileType === 'file' &&
           <div className={"flex flex-col items-center justify-center"}>
                <FileSVG size={"128"} />
               <span>{file.split("/").pop()}</span>
           </div>
        }

        <Button className={cn(
            'absolute top-4 right-4'
        )} variant={"destructive"}
                onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                }}
                disabled={isDeleting}
                size={"icon"}>
            {isDeleting ? <Loader2 size={"size-4 animate-spin"}/> : <XIcon className={"size-4"}/>}
        </Button>
    </div>
}

export function RenderUploadingState({progress, file}: { progress: number, file: File }) {
    return <div>
        <div className={"flex items-center justify-center text-center flex-col"}>
            {/*<p>{progress}</p>*/}
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className={"mt-2 text-sm font-medium text-foreground"}>Uploading ...</p>
            <p className={"mt-1 text-xs text-muted-foreground truncate max-w-xs"}>{file.name}</p>
        </div>
    </div>
}

