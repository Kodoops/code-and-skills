"use client"

import React from 'react';
import {Button} from "@/components/ui/button";
import {SendIcon} from "lucide-react";
import {adminPublishCourse} from "@/actions/admin/course";
import {handleActionResult} from "@/lib/handleActionResult";
import {useRouter} from "next/navigation";

const PublishCourseButton = ({id}:{id:string}) => {
    const router = useRouter();

    async function  handlePublish(id: string) {
        const result =  await adminPublishCourse(id);
        handleActionResult(result, {
            onSuccess: () => {
                console.log("✅ Cours published !");
                router.refresh();
            },
            onError: (message) => {
                console.warn("❌ Erreur:", message);
            },
        });
    }

    return (
        <Button size="icon"  onClick={()=>handlePublish(id)}>
            <SendIcon className="w-6 h-6"/>
        </Button>
    );
};

export default PublishCourseButton;