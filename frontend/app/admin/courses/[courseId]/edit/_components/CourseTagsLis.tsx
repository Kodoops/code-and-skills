"use client";

import React, {useEffect, useState, useTransition} from 'react';
import {PlusIcon} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Tag} from "@/models";
import {updateCourseTags} from "@/actions/admin/course";
import {adminGetAllTags} from "@/actions/admin/tags";
import {useRouter} from "next/navigation";

const CourseTagList = ({ courseId, existingTags}:
                        {  courseId: string, existingTags: Tag [] }) => {



    const selection = existingTags.map(t => t.id)
    const [tags, setTags] = useState<Tag []>(existingTags) // fetched tags of the course
    const [allTags, setAllTags] = useState<Tag[] >([]) // fetched all tags
    const [selected, setSelected] = useState<string[]>(selection)
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter();

    const handleUpdate = () => {
        startTransition(async () => {
            await updateCourseTags(courseId, selected)
            if (allTags !== null)
                setTags(allTags.filter(t => selected.includes(t.id)))
            setOpen(false)

            toast.success("Tags updated successfully",{
                style: {
                    background: "#D1FAE5",
                    color: "#065F46",
                },
            });
            router.refresh();
        })
    }

    const toggleTag = (tagId: string) => {
        setSelected(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        )
    }

    const getAllTags = async () => {
        const response = await adminGetAllTags();
        if (response.status === "success" && response.data) {
            setAllTags(response.data);
        } else {
            setAllTags([]);
            toast.error(response.message || "Impossible de charger les tags");
        }
    }

    useEffect(() => {
         getAllTags();
    },[])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon className="mr-2"/> Attach / Update Tags
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Update Course Tags</DialogTitle>
                </DialogHeader>

                <div className="flex flex-wrap gap-2 py-4 max-h-[300px] overflow-y-auto">
                    {allTags?.map(tag => {
                        const isSelected = selected.includes(tag.id)
                        return (
                            <Button
                                key={tag.id}
                                variant={isSelected ? "default" : "outline"}
                                className={`border ${isSelected ? "border-primary" : "border-muted"}`}
                                onClick={() => toggleTag(tag.id)}
                            >
                                {tag.title}
                            </Button>
                        )
                    })}
                </div>

                <DialogFooter className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={isPending}>
                        {isPending ? "Saving..." : "Update Tags"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CourseTagList;
