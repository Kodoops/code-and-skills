import EmptyState from "@/components/general/EmptyState";
import {QUIZ_PER_PAGE} from "@/constants/admin-contants";
import {AddQuizCardSkeleton} from "@/app/admin/courses/[courseId]/edit/quiz/_components/AddQuizCard";
import {notFound} from "next/navigation";
import AttachQuizForm from "@/app/admin/courses/[courseId]/edit/quiz/_components/AttachQuizForm";
import {Suspense} from "react";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {ArrowLeftIcon} from "lucide-react";
import {adminGetAvailableQuiz, getQuizOfCourse} from "@/actions/admin/quiz";

type Params = Promise<{ courseId: string }>;

const AddQuizPage = async (props: {
    params: Params;
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const {courseId} = await props.params;
    if (!courseId) notFound();

    const foundedQuiz = await getQuizOfCourse(courseId);

    const searchParams = await props.searchParams;
    const page = parseInt(searchParams?.page ?? "1", 10);

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>List of Available Quiz / Evaluations</h1>
            </div>
            <Suspense fallback={<AdminCourseCardSkeletonLayout/>}>
                <RenderQuiz current={page} nbrPage={QUIZ_PER_PAGE} courseId={courseId} quizId={foundedQuiz? foundedQuiz.id : undefined }/>
            </Suspense>
        </>
    );
}

export default AddQuizPage;

async function RenderQuiz({current, nbrPage, courseId, quizId}: {
    current?: number | undefined,
    nbrPage: number,
    courseId: string
    quizId?: string;
}) {

    const {data, totalPages, perPage, currentPage} = await adminGetAvailableQuiz(current, nbrPage);

    return (
        <>
            {data?.length === 0 ?
               <>
                   <Link href={`/admin/courses/${courseId}/edit`} className={cn(buttonVariants({className:"w-48"}))}>
                      <ArrowLeftIcon className={"size-4"} /> Go Back to Course
                   </Link>
                   <EmptyState title={"No Available Quiz Found"}
                               description={"You don't have any quiz available . Create a new quiz to get started."}
                               buttonText={"Create Quiz"}
                               href={"/admin/quiz/create"}
                   />
               </>
                :
                <>
                    <AttachQuizForm courseId={courseId}
                                    chapterId={undefined}
                                    data={data}
                                    quizId={quizId}
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                    />
                </>
            }
        </>
    )
}

function AdminCourseCardSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7  ">
            {Array.from({length: 4}).map((_, index) => (
                <AddQuizCardSkeleton key={index}/>
            ))}
        </div>
    )

}
