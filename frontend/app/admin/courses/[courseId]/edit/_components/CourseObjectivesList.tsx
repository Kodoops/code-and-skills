"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { adminUpdateObjectives } from "@/actions/admin/course";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

const CourseObjectivesList = ({
                                  courseId,
                                  existingObjectives,
                              }: {
    courseId: string;
    existingObjectives: string[];
}) => {
    const [objectives, setObjectives] = useState<string[]>(existingObjectives);
    const [newObjective, setNewObjective] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAdd = () => {
        if (newObjective.trim()) {
            setObjectives([...objectives, newObjective.trim()]);
            setNewObjective("");
        }
    };

    const handleRemove = (index: number) => {
        setObjectives(objectives.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        startTransition(async () => {
            const result = await adminUpdateObjectives(courseId, objectives);
            if (result.status === "success") {
                toast.success(result.message, {
                    style: { background: "#D1FAE5", color: "#065F46" },
                });
                router.refresh();
            } else {
                toast.error(result.message, {
                    style: { background: "#FEE2E2", color: "#991B1B" },
                });
            }
        });
    };

    return (
        <div className="space-y-4 border rounded-md p-4">
            <h3 className="font-semibold text-lg">🎯 Course Objectives</h3>

            <div className="flex gap-2">
                <Input
                    placeholder="Add new objective"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                />
                <Button type="button" onClick={handleAdd}>
                    <PlusIcon className="size-4 mr-1" /> Add
                </Button>
            </div>

            <ul className="list-disc list-inside space-y-1">
                {objectives.map((obj, index) => (
                    <li key={index} className="flex justify-between items-center">
                        <span>{obj}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(index)}
                        >
                            ❌
                        </Button>
                    </li>
                ))}
            </ul>

            <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Saving..." : "Save Objectives"}
            </Button>
        </div>
    );
};

export default CourseObjectivesList;