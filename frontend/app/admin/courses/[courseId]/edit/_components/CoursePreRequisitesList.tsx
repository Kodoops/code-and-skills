"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { adminUpdatePrerequisites } from "@/actions/admin/course";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

/**
 * 🧩 Gestion des prérequis d’un cours (admin)
 */
const CoursePrerequisitesList = ({
                                     courseId,
                                     existingPrerequisites,
                                 }: {
    courseId: string;
    existingPrerequisites: string[];
}) => {
    const [prerequisites, setPrerequisites] = useState<string[]>(existingPrerequisites);
    const [newPrerequisite, setNewPrerequisite] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAdd = () => {
        if (newPrerequisite.trim()) {
            setPrerequisites([...prerequisites, newPrerequisite.trim()]);
            setNewPrerequisite("");
        }
    };

    const handleRemove = (index: number) => {
        setPrerequisites(prerequisites.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        startTransition(async () => {
            const result = await adminUpdatePrerequisites(courseId, prerequisites);
            if (result.status === "success") {
                toast.success(result.message, {
                    style: { background: "#D1FAE5", color: "#065F46" },
                });
                router.refresh(); // ✅ Rafraîchit la page parent (Server Component)
            } else {
                toast.error(result.message, {
                    style: { background: "#FEE2E2", color: "#991B1B" },
                });
            }
        });
    };

    return (
        <div className="space-y-4 border rounded-md p-4">
            <h3 className="font-semibold text-lg">🧩 Course Prerequisites</h3>

            <div className="flex gap-2">
                <Input
                    placeholder="Add new prerequisite"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                />
                <Button type="button" onClick={handleAdd}>
                    <PlusIcon className="size-4 mr-1" /> Add
                </Button>
            </div>

            <ul className="list-disc list-inside space-y-1">
                {prerequisites.map((pre, index) => (
                    <li key={index} className="flex justify-between items-center">
                        <span>{pre}</span>
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
                {isPending ? "Saving..." : "Save Prerequisites"}
            </Button>
        </div>
    );
};

export default CoursePrerequisitesList;