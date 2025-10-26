import { getCourseBySlug, checkIfCourseBought } from "@/actions/auth/course";
import CardError from "@/components/custom-ui/CardError";
import {CoursePlayer} from "@/app/dashboard/courses/[slug]/_components/CoursePlayer";

interface Props {
    params: { slug: string };
    searchParams: { lessonId?: string };
}

const CourseSlugPage = async ({ params, searchParams }: Props) => {
    const { slug } = await params;
    const { lessonId } = searchParams;

    const response = await getCourseBySlug(slug);

    if (!response || response.status !== "success" || !response.data)
        return <CardError message="Course not found" title="Error" />;

    const course = response.data;
    const enrollmentResponse = await checkIfCourseBought(course.id);
    const enrollment =
        enrollmentResponse?.status === "success" ? enrollmentResponse.data : null;

    return <CoursePlayer course={course} enrollment={enrollment}  lessonId={lessonId }/>;
};

export default CourseSlugPage;