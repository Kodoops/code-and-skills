"use client";

import React, {useEffect, useState, useTransition} from "react";
import {Lesson, Chapter} from "@/models";
import {CheckCircle, CheckCircle2, EllipsisIcon, Loader2} from "lucide-react";
import {
    markLessonComplete,
    markLessonUnCompleted,
} from "@/actions/auth/lesson";
import {handleActionResult} from "@/lib/handleActionResult";
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";
import {CourseProgressResult} from "@/hooks/use-course-progress";

interface Props {
    courseChapters: Chapter[];
    currentLesson: Lesson | null;
    onSelectLesson: (lesson: Lesson) => void;
    courseSlug: string;
    courseId: string;
    reloadProgress: () => void;
    completed: boolean,
    isActive: boolean,
}

const RenderVideo = ({
                         courseChapters,
                         currentLesson,
                         onSelectLesson,
                         courseSlug,
                         courseId,
                         reloadProgress,
                         completed,
                         isActive,
                     }: Props) => {
    const [countdown, setCountdown] = useState<number>(5);
    const [isReady, setIsReady] = useState<boolean>(true);
    const [isPending, startTransition] = useTransition();

    const allLessons = courseChapters.flatMap((c) => c.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);

    function getNextLesson(isActive: boolean) {
        if (currentIndex === -1) return null;

        // on cherche la prochaine leçon qui correspond à la condition d’accès
        for (let i = currentIndex + 1; i < allLessons.length; i++) {
            const next = allLessons[i];
            if (isActive || next.publicAccess) {
                return next;
            }
        }

        return null;
    }

    function getPrevLesson(isActive: boolean) {
        if (currentIndex === -1) return null;

        for (let i = currentIndex - 1; i >= 0; i--) {
            const prev = allLessons[i];
            if (isActive || prev.publicAccess) {
                return prev;
            }
        }

        return null;
    }

    const nextLesson = getNextLesson(isActive);
    const prevLesson = getPrevLesson(isActive);

    // 🕐 countdown initial
    useEffect(() => {
        if (currentLesson) {
            setCountdown(3);
            setIsReady(false);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsReady(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [currentLesson]);

    // ✅ Marquer comme terminé et passer à la suivante
    function handleMarkCompleted() {
        if (!currentLesson) return;

        startTransition(async () => {
            const result = await markLessonComplete(
                currentLesson.id,
                courseSlug,
                courseId
            );

            handleActionResult(result, {
                onSuccess: () => {
                    reloadProgress();

                    if (nextLesson) {
                        onSelectLesson(nextLesson);
                    }
                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        });
    }

    // 🔴 Marquer comme non terminée, sans changer de leçon
    function handleMarkUncompleted() {
        if (!currentLesson) return;

        startTransition(async () => {
            const result = await markLessonUnCompleted(currentLesson.id, courseSlug);

            handleActionResult(result, {
                onSuccess: async () => {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    reloadProgress(); // ✅ met à jour la progression

                },
                onError: (message) => {
                    console.warn("❌ Erreur:", message);
                },
            });
        });
    }

    // 🧠 Rendu
    if (!currentLesson)
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <h2 className="text-2xl font-bold mb-2">Select a lesson</h2>
                <p className="text-muted-foreground">
                    Choose a lesson from the sidebar to start learning.
                </p>
            </div>
        );

    const progression = ((5 - countdown) / 5) * 100;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progression / 100) * circumference;

    return (
        <div className="relative flex flex-col">
            {/* Video Player */}
            <div
                key={currentLesson.id}
                className="aspect-video bg-black relative rounded-lg overflow-hidden flex items-center justify-center"
            >
                {!isReady ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center">
                        <div className="relative w-40 h-40">
                            <svg
                                className="w-full h-full transform -rotate-90"
                                viewBox="0 0 120 120"
                            >
                                <circle
                                    cx="60"
                                    cy="60"
                                    r={radius}
                                    stroke="#555"
                                    strokeWidth="6"
                                    fill="none"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r={radius}
                                    stroke="#f97316"
                                    strokeWidth="6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                                />
                            </svg>
                            <span
                                className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold">
                {countdown}
              </span>
                        </div>
                        <p className="text-white/80 mt-4 text-sm animate-pulse">
                            Preparing your lesson...
                        </p>
                    </div>
                ) : (
                    <video
                        key={currentLesson.videoKey}
                        controls
                        autoPlay
                        poster={currentLesson.thumbnailKey ?? ""}
                        className="w-full h-full object-cover"
                    >
                        <source src={currentLesson.videoKey} type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>

            <div className="space-y-3 pt-3">
                <h1 className={"text-3xl font-bold tracking-tight text-foreground "}>{currentLesson.title}</h1>

                {currentLesson.description && (
                    <RenderDescription json={(JSON.parse(currentLesson.description))}/>
                )}
            </div>

            {/* Navigation + actions */}
            <div className="flex justify-between items-center mt-6 border-t border-border pt-4 cursor-pointer">
                <button
                    onClick={() => prevLesson && onSelectLesson(prevLesson)}
                    disabled={!prevLesson}
                    className={`px-4 py-2 rounded-md font-medium ${
                        prevLesson
                            ? "bg-muted-foreground/30 hover:bg-primary/80 text-foreground"
                            : "bg-muted/30 text-muted-foreground cursor-not-allowed"
                    }`}
                >
                    ◀
                </button>

                {!completed ? <button
                        onClick={handleMarkCompleted}
                        disabled={isPending}
                        className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
                    >
                        {isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin"/>
                        ) : (
                            <CheckCircle2 className="h-5 w-5"/>
                        )}
                        {isPending ? "Saving..." : " Marquer comme terminée"}
                    </button>
                    :
                    <button
                        onClick={handleMarkUncompleted}
                        disabled={isPending}
                        className="flex items-center gap-2 bg-muted-foreground/20 hover:bg-muted-foreground/40 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
                    >
                        {isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin"/>
                        ) : (
                            <EllipsisIcon className="h-5 w-5"/>
                        )}
                        {isPending ? "Saving..." : "Marquer comme non terminée"}
                    </button>
                }

                <button
                    onClick={() => nextLesson && onSelectLesson(nextLesson)}
                    disabled={!nextLesson}
                    className={`px-4 py-2 rounded-md font-medium cursor-pointer ${
                        nextLesson
                            ? "bg-muted-foreground/30 hover:bg-primary/80 text-foreground"
                            : "bg-muted/30 text-muted-foreground cursor-not-allowed"
                    }`}
                >
                    ▶
                </button>
            </div>
        </div>
    );
};

export default RenderVideo;