"use client";

import {useRouter} from "next/navigation";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {X} from "lucide-react";
import {Category, LEVELS} from "@/models";

interface Props {
    current: {
        categorySlug?: string;
        level?: string;
        isFree?: string;
    };
    categories: Category[];
}



const CoursesFilterBar = ({current, categories}: Props) => {
    const router = useRouter();

    const [resetKey, setResetKey] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState(current.categorySlug);
    const [selectedLevel, setSelectedLevel] = useState(current.level);
    const [selectedIsFree, setSelectedIsFree] = useState(current.isFree);

    const hasActiveFilters =
        (selectedCategory && selectedCategory !== "all") ||
        (selectedLevel && selectedLevel !== "all") ||
        (selectedIsFree && selectedIsFree !== "all");

    const updateParam = (key: string, value?: string) => {
        const currentParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();

        if (!value || value === "all") {
            currentParams.delete(key);
        } else {
            currentParams.set(key, value);
        }

        const search = currentParams.toString();
        router.push(`/courses${search ? `?${search}` : ""}`);
    };

    const resetFilters = () => {
        setSelectedCategory(undefined);
        setSelectedLevel(undefined);
        setSelectedIsFree(undefined);
        setResetKey(prev => prev + 1);
        router.push("/courses");
    };

    return (
        <div className="flex flex-wrap gap-4 items-center justify-between border p-4 rounded-md">
            <div className="space-x-2 flex items-center">
                <span>Filtrer par : </span>
                {/* Bouton Réinitialiser */}
                {hasActiveFilters && (
                    <Button onClick={resetFilters} variant={"default"} title="Réinitialiser les filtres">
                        <X className="w-5 h-5"/>
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-4 flex-row flex-wrap ">

                {/* Catégorie */}
                 <Select
                    key={`category-${resetKey}`}
                    onValueChange={(val) => {
                        setSelectedCategory(val);
                        updateParam("categorySlug", val);
                    }}
                    value={selectedCategory}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Catégorie"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.slug}>
                                {cat.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Niveau */}
                <Select
                    key={`level-${resetKey}`}
                    onValueChange={(val) => {
                        setSelectedLevel(val);
                        updateParam("level", val);
                    }}
                    value={selectedLevel}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Niveau"/>
                    </SelectTrigger>
                    <SelectContent>
                        {LEVELS.map((lvl) => (
                            <SelectItem key={lvl} value={lvl}>
                                {lvl}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Gratuit / Payant */}
                <Select
                    key={`isFree-${resetKey}`}
                    onValueChange={(val) => {
                        setSelectedIsFree(val);
                        updateParam("isFree", val);
                    }}
                    value={selectedIsFree}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tarification"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="true">Gratuit</SelectItem>
                        <SelectItem value="false">Payant</SelectItem>
                    </SelectContent>
                </Select>
            </div>

        </div>
    );
};

export default CoursesFilterBar;
