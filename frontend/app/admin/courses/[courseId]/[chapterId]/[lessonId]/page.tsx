import React from 'react';
import {LessonForm} from "@/app/admin/courses/[courseId]/[chapterId]/[lessonId]/_components/LessonForm";
import {adminGetLesson} from "@/actions/admin/lesson";
import CardError from "@/components/custom-ui/CardError";

type Params = Promise<{
    courseId:string,
    chapterId:string,
    lessonId:string,
}>

const LessonIdPage = async ({params}:{params:Params}) => {

    const {courseId, chapterId, lessonId} = await params;

     const response = await adminGetLesson(lessonId);

    if (!response || response.status=== "error") {
        return <CardError message={response.message ?? "❌ Impossible de charger la lesson."} title={"Erreur chargement"} />
    }

    return (
        <LessonForm chapterId={chapterId} data={response.data!} courseId={courseId}/>
    );
};

export default LessonIdPage;
