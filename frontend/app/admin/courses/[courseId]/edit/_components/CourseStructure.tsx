"use client";

import React, {ReactNode, useEffect, useState} from 'react';
import {
    DndContext, DragEndEvent,
    DraggableSyntheticListeners,
    KeyboardSensor,
    PointerSensor,
    rectIntersection,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
    arrayMove, SortableContext,
    sortableKeyboardCoordinates,
    useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import {cn} from "@/lib/utils";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {BookOpenCheck, ChevronDownIcon, ChevronRightIcon, FileText, GripVertical, PlusIcon} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {toast} from "sonner";
import {NewChapterModal} from "@/app/admin/courses/[courseId]/edit/_components/NewChapterModal";
import {NewLessonModal} from "@/app/admin/courses/[courseId]/edit/_components/NewLessonModal";
import {DeleteLesson} from "@/app/admin/courses/[courseId]/edit/_components/DeleteLesson";
import {DeleteChapter} from './DeleteChapter';
import ReviewQuiz from "@/app/admin/courses/[courseId]/edit/quiz/_components/ReviewQuiz";
import {DetachQuiz} from "@/app/admin/courses/[courseId]/edit/quiz/_components/DetachQuiz";
import {Course, Quiz} from "@/models";
import {reorderChapters} from "@/actions/admin/chapter";
import {reorderLessons} from "@/actions/admin/lesson";

interface Props {
    data: Course,
    quizzes: Quiz[] | null;
}


interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => ReactNode;
    className?: string;
    data?: {
        type: "chapter" | "lesson";
        chapterId?: string; // this only relevant for lessons
    }
}

const CourseStructure = ({data, quizzes}: Props) => {

        const initialItems = data?.chapters.map((chapter) => (
            {
                id: chapter.id,
                title: chapter.title,
                order: chapter.position,
                isOpen: true, // default chapters to open
                lessons: chapter.lessons.map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title,
                    order: lesson.position,
                })),
            }
        )) || [];

        const [items, setItems] = useState(initialItems);

        const findChapterQuiz = (id: string) => {
            if (!quizzes || quizzes.length === 0) return null;
            return quizzes.filter(quiz => quiz.chapterId === id)[0];
        }


        useEffect(() => {
            setItems((prevItems) => {
                const updatedItems = data?.chapters.map((chapter) => ({
                    id: chapter.id,
                    title: chapter.title,
                    order: chapter.position,
                    isOpen: prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true, // default chapters to open
                    lessons: chapter.lessons.map((lesson) => ({
                        id: lesson.id,
                        title: lesson.title,
                        order: lesson.position,
                    })),
                })) || [];

                return updatedItems;
            });
        }, [data]);

        function SortableItem({children, id, className, data}: SortableItemProps) {
            const {
                attributes,
                listeners,
                setNodeRef,
                transform,
                transition,
                isDragging,
            } = useSortable({id: id, data: data});

            const style = {
                transform: CSS.Transform.toString(transform),
                transition,
            };

            return (
                <div ref={setNodeRef} style={style} {...attributes}
                     className={cn("touch-none", className, isDragging ? "z-10" : "")}>
                    {children(listeners)}
                </div>
            );
        }


        function handleDragEnd(event: DragEndEvent) {
            const {active, over} = event;

            if (!over || active.id === over.id) {
                return;
            }

            const activeId = active.id;
            const overId = over.id;
            const activeType = active.data.current?.type as "chapter" | "lesson";
            const overType = over.data.current?.type as "chapter" | "lesson";
            const courseId = data?.id;

            if (activeType === "chapter") {
                let targetChapterId = null;
                if (overType === "chapter") {
                    targetChapterId = overId;
                } else {  // if(overType === "lesson")
                    targetChapterId = over.data.current?.chapterId ?? null;
                }

                if (!targetChapterId) {
                    toast.error("Could not determine the chapter for ordering", {
                        style: {
                            background: "#FEE2E2",
                            color: "#991B1B",
                        },
                    });
                    return;
                }

                const oldIndex = items.findIndex((item) => item.id === activeId);
                const newIndex = items.findIndex((item) => item.id === targetChapterId);
                if (oldIndex === -1 || newIndex === -1) {
                    toast.error("Could not determine the chapter new/old index for ordering", {
                        style: {
                            background: "#FEE2E2",
                            color: "#991B1B",
                        },
                    });
                    return;
                }

                const reorderedLocalChapter = arrayMove(items, oldIndex, newIndex);
                const updatedChaptersForState = reorderedLocalChapter.map((chapter, index) => ({
                    ...chapter,
                    order: index + 1,
                }));

                const previousItems = [...items];

                setItems(updatedChaptersForState);

                if (courseId) {
                    const chaptersToUpdate = updatedChaptersForState.map((chapter) => ({
                        id: chapter.id,
                        position: chapter.order,
                    }));

                    const reorderPromise = () => reorderChapters(courseId, chaptersToUpdate);

                    toast.promise(reorderPromise(), {
                        loading: "Reordering Chapters",
                        success: (result) => {
                            if (result.status === "success") {
                                return {
                                    message: result.message,
                                    style: {
                                        background: "#D1FAE5",
                                        color: "#065F46",
                                    },
                                }
                            }
                            throw new Error(result.message);
                        },
                        error: () => {
                            setItems(previousItems);
                            return {
                                message: "Failed to reorder chapters",
                                style: {
                                    background: "#FEE2E2",
                                    color: "#991B1B",
                                }
                            };
                        },
                    });
                }

                return;
            }

            if (activeType === "lesson" && overType === "lesson") {
                const chapterId = active.data.current?.chapterId;
                const overChapterId = over.data.current?.chapterId;

                if (!chapterId || !overChapterId || chapterId !== overChapterId) {
                    toast.error("Lessons move between different chapters or invalid chapter ID is not allowed.", {
                        style: {
                            background: "#FEE2E2",
                            color: "#991B1B",
                        },
                    });
                    return;
                }

                const chapterIndex = items.findIndex((chapter) => chapter.id === chapterId);
                if (chapterIndex === -1) {
                    toast.error("Could not determine the chapter for ordering", {
                        style: {
                            background: "#FEE2E2",
                            color: "#991B1B",
                        },
                    });
                    return;
                }
                const chapterToUpdate = items[chapterIndex];

                const oldLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === activeId);
                const newLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === overId);

                if (oldLessonIndex === -1 || newLessonIndex === -1) {
                    toast.error("Could not determine the lesson new/old index for ordering", {
                        style: {
                            background: "#FEE2E2",
                            color: "#991B1B",
                        },
                    });
                    return;
                }
                const reorderedLocalLessons = arrayMove(chapterToUpdate.lessons, oldLessonIndex, newLessonIndex);
                const updatedLessonsForState = reorderedLocalLessons.map((lesson, index) => ({
                    ...lesson,
                    order: index + 1,
                }));

                const newItems = [...items];
                newItems[chapterIndex] = {
                    ...chapterToUpdate,
                    lessons: updatedLessonsForState,
                }
                const previousItems = [...items];
                setItems(newItems);

                if (courseId) {
                    const lessonsToUpdate = updatedLessonsForState.map((lesson) => ({
                        id: lesson.id,
                        position: lesson.order,
                    }));

                    const reorderLessonsPromise = () => reorderLessons(chapterId, lessonsToUpdate);
                    toast.promise(reorderLessonsPromise(), {
                        loading: "Reordering Lessons",
                        success: (result) => {
                            if (result.status === "success") {
                                return {
                                    message: result.message,
                                    style: {
                                        background: "#D1FAE5",
                                        color: "#065F46",
                                    },
                                }
                            }
                            throw new Error(result.message);
                        },
                        error: () => {
                            setItems(previousItems);
                            return {
                                message: "Failed to reorder lessons",
                                style: {
                                    background: "#FEE2E2",
                                    color: "#991B1B",
                                }
                            };
                        }
                    })
                }

                return;
            }
        }

        function toggleChapter(chapterId: string) {
            setItems(
                items.map((chapter) => chapter.id === chapterId ? {...chapter, isOpen: !chapter.isOpen} : chapter)
            )
        }

        const sensors = useSensors(
            useSensor(PointerSensor),
            useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
            })
        );

        return (
            <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
                <Card>
                    <CardHeader className={"flex flex-row items-center justify-between border-b border-border"}>
                        <CardTitle>Chapters</CardTitle>
                        {data && <NewChapterModal courseId={data.id}/>}
                    </CardHeader>
                    <CardContent className={"space-y-4"}>
                        <SortableContext items={items} strategy={verticalListSortingStrategy}>
                            {items.map((item) => (
                                <SortableItem key={item.id} id={item.id} data={{type: "chapter"}}>
                                    {(listeners) => (
                                        <Card>
                                            <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                                                <div
                                                    className="flex items-center justify-between p-3 border-b border-border">
                                                    <div className="flex items-center gap-2">
                                                        <Button size={"icon"} variant={"ghost"}
                                                                {...listeners} >
                                                            <GripVertical className={"size-4"}/>
                                                        </Button>
                                                        <CollapsibleTrigger asChild>
                                                            <Button size={"icon"} variant={"ghost"}
                                                                    className={"flex items-center"}>
                                                                {item.isOpen ? <ChevronDownIcon className={"size-4"}/>
                                                                    : <ChevronRightIcon className={"size-4"}/>}
                                                            </Button>
                                                        </CollapsibleTrigger>
                                                        <p className={"cursor-pointer hover:text-primary pl-2"}>{item.title}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">

                                                        {findChapterQuiz(item.id) ?
                                                            <div className="flex items-center justify-between gap-4">
                                                                <ReviewQuiz quiz={findChapterQuiz(item.id)!}/>
                                                                <DetachQuiz quizId={findChapterQuiz(item.id)!.id}
                                                                            courseId={data?.id}/>
                                                            </div>
                                                            :<>
                                                                <Link href={`/admin/courses/${data.id}/${item.id}/quiz/add`}
                                                                      className={cn(buttonVariants({variant: "outline"}))}>
                                                                    <BookOpenCheck className={"size-4"}/> Add Quiz
                                                                </Link>
                                                            </>}

                                                        {data && <DeleteChapter chapterId={item.id} courseId={data?.id}/>}
                                                    </div>
                                                </div>

                                                <CollapsibleContent>
                                                    <div className="p-1">
                                                        <SortableContext
                                                            items={item.lessons.map((lesson) => lesson.id)}
                                                            strategy={verticalListSortingStrategy}
                                                        >
                                                            {item.lessons.map((lesson) => (
                                                                <SortableItem key={lesson.id} id={lesson.id}
                                                                              data={{type: "lesson", chapterId: item.id}}>
                                                                    {(lessonListeners) => (
                                                                        <div
                                                                            className={"flex items-center justify-between p-2 hover:bg-accent rounded-sm"}>
                                                                            <div className="flex items-center gap-2">
                                                                                <Button size={"icon"}
                                                                                        variant={"ghost"}  {...lessonListeners} >
                                                                                    <GripVertical className={"size-4"}/>
                                                                                </Button>
                                                                                <FileText className={"size-4"}/>
                                                                                <Link
                                                                                    href={`/admin/courses/${data?.id}/${item.id}/${lesson.id}`}>
                                                                                    {lesson.title}
                                                                                </Link>
                                                                            </div>
                                                                            {data && <DeleteLesson chapterId={item.id}
                                                                                                   courseId={data?.id}
                                                                                                   lessonId={lesson.id}/>}
                                                                        </div>
                                                                    )}
                                                                </SortableItem>
                                                            ))}
                                                        </SortableContext>
                                                        <div
                                                            className="flex items-center justify-between gap-4 p-4 pb-0 border-t border-border">
                                                            <div className="w-full ">
                                                                {data &&
                                                                    <NewLessonModal chapterId={item.id}
                                                                                    courseId={data?.id}/>}
                                                            </div>

                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </Card>
                                    )}
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </CardContent>
                </Card>
            </DndContext>
        );
    }
;

export default CourseStructure;
