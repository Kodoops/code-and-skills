"use client";
import { useEffect, useState } from "react";
import { Course } from "@/models";
import { getCourseProgress } from "@/actions/auth/lesson";

export interface CourseProgressResult {
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    completedLessonIds: string[];
    reload: () => void;
}

export function useCourseProgress({ courseData }: { courseData: Course }): CourseProgressResult {
    const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [reloadFlag, setReloadFlag] = useState(0);

    useEffect(() => {
        async function fetchProgress() {

            const res = await getCourseProgress(courseData.id);

            if (res.status === "success" && Array.isArray(res.data) ) {
                const completed = res.data
                    .filter((p: any) => p.completed)
                    .map((p: any) => p.lessonId);

                setCompletedLessonIds([...completed]);

                const totalLessons =courseData.chapters && courseData.chapters.flatMap((c) => c.lessons).length;
                setProgressPercentage((completed.length / totalLessons) * 100);
            }
        }

        fetchProgress();
    }, [courseData.id, reloadFlag]);

    return {
        totalLessons: courseData.chapters && courseData.chapters.flatMap((c) => c.lessons).length,
        completedLessons: completedLessonIds.length,
        completedLessonIds,
        progressPercentage,
        reload: () => setReloadFlag((prev) => prev + 1),
    };
}