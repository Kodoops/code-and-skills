"use client";

import {Check, ChevronDown, LockIcon, LockKeyholeIcon, Play, PlayIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Course, Lesson} from "@/models";
import {cn} from "@/lib/utils";
import {hasAccess} from "@/lib/access";
import {Progress} from "@/components/ui/progress";
import {CourseProgressResult} from "@/hooks/use-course-progress";
import {useEffect, useState} from "react";

export function CourseSidebar({
                                  course,
                                  enrolled,
                                  selectedLessonId,
                                  onLessonSelect,
                                  progress,
                              }: {
    course: Course;
    enrolled: boolean;
    selectedLessonId: string | null;
    onLessonSelect: (lesson: Lesson) => void;
    progress: CourseProgressResult;
}) {
    const {completedLessonIds, progressPercentage} = progress;
    const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

    // ✅ garde le même état même après re-render
    function toggleChapter(chapterId: string) {
        setOpenChapters((prev) => ({...prev, [chapterId]: !prev[chapterId]}));
    }

    useEffect(() => {
        if (course.chapters.length > 0) {
            const firstChapterId = course.chapters[0].id;
            setOpenChapters((prev) => ({...prev, [firstChapterId]: true}));
        }
    }, [course.chapters]);
    return (
        <div className="flex flex-col py-4 md:py-6 h-full">
            {/* Header */}
            <div className="pb-4 px-4 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Play className="size-5 text-primary"/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-semibold text-base truncate">{course.title}</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            {course.categoryTitle}
                        </p>
                    </div>
                </div>

                {/* ✅ Progression */}
                <div className="px-1">
                    <Progress value={progressPercentage || 0} className="h-2"/>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                        Progression: {Math.round(progressPercentage || 0)}%
                    </p>
                </div>
            </div>

            {/* Lessons */}
            <div className="py-4 pr-4 space-y-3 overflow-y-auto">
                {course.chapters.map((chapter, index) => (
                    <Collapsible
                        //key={chapter.id} defaultOpen={index === 0}
                        key={chapter.id}
                        //  defaultOpen={index === 0}
                        open={!!openChapters[chapter.id]}
                        onOpenChange={() => toggleChapter(chapter.id)}
                    >
                        <CollapsibleTrigger asChild>
                            <Button
                                className="w-full p-3 h-auto flex items-center gap-2 text-left"
                                variant="outline"
                            >
                                <ChevronDown className="size-4 text-primary"/>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm truncate">
                                        {chapter.position}. {chapter.title}
                                    </p>
                                </div>
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="pt-2 pl-4 space-y-3">
                            {chapter.lessons.map((lesson) => {
                                const accessible = hasAccess(
                                    lesson.publicAccess,
                                    course,
                                    enrolled
                                );
                                const isActive = selectedLessonId === lesson.id;
                                const completed = completedLessonIds.includes(lesson.id);

                                if (accessible) {
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => onLessonSelect(lesson)}
                                            className={cn(
                                                "w-full p-2 rounded-md text-left transition-all flex items-center gap-4 justify-start focus-visible:ring-2 focus-visible:ring-primary/60 hover:cursor-pointer",
                                                completed &&
                                                "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
                                                isActive &&
                                                !completed &&
                                                "bg-primary/10 dark:bg-primary/20 text-primary"
                                            )}
                                        >
                                            {/* Icône */}
                                            <div className="shrink-0">
                                                {completed ? (
                                                    <div
                                                        className="size-5 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center">
                                                        <Check className="size-3 text-white"/>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={cn(
                                                            "size-5 rounded-full bg-background flex items-center justify-center border",
                                                            isActive
                                                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                                                : "border-muted-foreground/60"
                                                        )}
                                                    >
                                                        <PlayIcon
                                                            className={cn(
                                                                "size-2.5 fill-current",
                                                                isActive
                                                                    ? "text-primary"
                                                                    : "text-muted-foreground"
                                                            )}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Titre */}
                                            <div className="flex-1 text-left min-w-0">
                                                <p
                                                    className={cn(
                                                        "text-xs font-medium truncate",
                                                        completed
                                                            ? "text-green-800 dark:text-green-200"
                                                            : isActive
                                                                ? "text-primary font-semibold"
                                                                : "text-muted-foreground"
                                                    )}
                                                >
                                                    {lesson.position}. {lesson.title}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                }

                                return (
                                    <div
                                        key={lesson.id}
                                        className={cn(
                                            "w-full p-2 rounded-md text-left transition-all flex items-center gap-4 justify-start focus-visible:ring-2 " +
                                            "focus-visible:ring-primary/60 hover:cursor-not-allowed",
                                        )}
                                    >
                                        {/* Icône */}
                                        <div className="shrink-0">

                                            <div
                                                className={cn(
                                                    "size-5 rounded-full bg-background flex items-center justify-center border",
                                                    isActive
                                                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                                                        : "border-muted-foreground/60"
                                                )}
                                            >
                                                <LockKeyholeIcon
                                                    className={cn(
                                                        "size-2.5 text-muted-foreground"
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Titre */}
                                        <div className="flex-1 text-left min-w-0">
                                            <p
                                                className={cn(
                                                    "text-xs font-medium truncate",
                                                    completed
                                                        ? "text-green-800 dark:text-green-200"
                                                        : isActive
                                                            ? "text-primary font-semibold"
                                                            : "text-muted-foreground"
                                                )}
                                            >
                                                {lesson.position}. {lesson.title}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
}