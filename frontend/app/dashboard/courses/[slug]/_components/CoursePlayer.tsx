"use client";

import React, {useCallback, useEffect, useState} from "react";
import { CourseSidebar } from "./CourseSidebar";
import RenderVideo from "./RenderVideo";
import { Course, Enrollment, Lesson } from "@/models";
import { useCourseProgress } from "@/hooks/use-course-progress";

export const CoursePlayer = ({
                                 course,
                                 enrollment,
                                lessonId,
                             }: {
    course: Course;
    enrollment: Enrollment | null;
    lessonId?: string | null;  // lessonId from searchParams
}) => {

    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const progress = useCourseProgress({ courseData: course });
    const [isActive, setIsActive] = useState(false)

    const reloadProgress = useCallback(() => {
        progress.reload();
    }, [progress]);

    useEffect(() => {
        if (!course) return;

        let lessonToPlay: Lesson | null = null;

        if (lessonId) {
            const foundLesson =
                course.chapters
                    .flatMap((chapter) => chapter.lessons) // ✅ combine toutes les leçons de tous les chapitres
                    .find((lesson) => lesson.id === lessonId) || null; // ✅ cherche la leçon voulue

            if (foundLesson) {
                setSelectedLesson(foundLesson);
                return; // 🔥 stoppe ici pour éviter d’écraser le choix ensuite
            }
        }

        setIsActive( course.price === 0 ||
            enrollment?.status?.toUpperCase() === "ACTIVE" ||
            enrollment?.status === "Active")

        if (isActive && course.chapters.length > 0) {
            const firstChapter = course.chapters[0];
            if (firstChapter.lessons.length > 0)
                lessonToPlay = firstChapter.lessons[0];
        }

        if (!lessonToPlay) {
            for (const chapter of course.chapters) {
                for (const lesson of chapter.lessons || []) {
                    if (lesson.publicAccess) {
                        lessonToPlay = lesson;
                        break;
                    }
                }
                if (lessonToPlay) break;
            }
        }

        setSelectedLesson((prev) => prev ?? lessonToPlay);

    }, []);

    return (
        <div className="flex flex-1 min-h-screen">
            <div className="w-80 border-r border-border shrink-0">
                <CourseSidebar
                    course={course}
                    enrolled={!!enrollment}
                    selectedLessonId={selectedLesson?.id || null}
                    onLessonSelect={setSelectedLesson}
                    progress={progress}
                />
            </div>

            <div className="flex-1 overflow-hidden p-4">
                <RenderVideo
                    courseChapters={course.chapters}
                    currentLesson={selectedLesson}
                    onSelectLesson={setSelectedLesson}
                    courseSlug={course.slug}
                    courseId={course.id}
                    reloadProgress={reloadProgress}
                    completed={progress.completedLessonIds.includes(selectedLesson?.id || "")}
                    isActive={ isActive}
                />
            </div>
        </div>
    );
};