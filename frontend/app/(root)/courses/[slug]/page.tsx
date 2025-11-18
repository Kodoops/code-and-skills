import React from 'react';
import Image from "next/image";
import {IconBook, IconCategory, IconChartBar, IconChevronDown, IconClock, IconPlayerPlay} from "@tabler/icons-react";
import {Badge} from '@/components/ui/badge';
import {Separator} from "@/components/ui/separator";
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Card, CardContent} from "@/components/ui/card";
import {CheckIcon} from "lucide-react";
import Link from 'next/link';
import {EnrollmentButton} from "@/app/(root)/courses/[slug]/_components/EnrollmentButton";
import {buttonVariants} from "@/components/ui/button";
import {hasAccess} from "@/lib/access";
import {calculatedPrice} from "@/lib/price";
import ProductPrice from "@/components/custom-ui/ProductPrice";
import AuthorBanner from "@/components/custom-ui/AuthorBanner";
import {adminGetCourseBySlug} from "@/actions/public/course";
import { notFound } from 'next/navigation';
import ObjectivesAndRequisites from "@/components/custom-ui/ObjectivesAndRequisites";
import {checkIfCourseBought} from "@/actions/auth/course";
import {useConstructUrl} from "@/hooks/use-construct-url";

type Params = Promise<{ slug: string }>

const SingleCoursePage = async ({params}: { params: Params }) => {
    const {slug} = await params;
    let course = null;
    const response = await adminGetCourseBySlug(slug);

    if(!response || !response.data)
        return notFound();
    else{
        course = response.data;
    }


    const res =  await checkIfCourseBought(course.id);

    const isEnrolled = res.data? true: false;

    const finalPrice = calculatedPrice(course.price!, course.promotions?.length > 0 ? course.promotions[0]: undefined);

    const thumbnailUrl  = useConstructUrl(course.fileKey);

    return (
        <div className={"grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5"}>
            <div className="order-1 lg:col-span-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                    <Image src={thumbnailUrl}
                           alt={course.title} fill className={"object-cover"}
                           priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <h1 className={"text-4xl font-bold tracking-tight"}>{course.title}</h1>
                        <p className={"text-lg text-muted-foreground leading-relaxed line-clamp-2"}>{course.smallDescription}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Badge className={"flex items-center gap-1 px-3 py-1"}>
                            <IconChartBar className={"size-4"}/>
                            <span className={"capitalize"}>{course.level.toLowerCase()}</span>
                        </Badge>
                        <Badge className={"flex items-center gap-1 px-3 py-1"}>
                            <IconCategory className={"size-4"}/>
                            <span>{course.categoryTitle}</span>
                        </Badge>
                        <Badge className={"flex items-center gap-1 px-3 py-1"}>
                            <IconClock className={"size-4"}/>
                            <span>{course.duration} hours</span>
                        </Badge>
                    </div>

                    <AuthorBanner
                        name={course.user ? course.user.lastname + ' ' + course.user.firstname : "N.C" }
                        title={course.user ? course.user.title : ""}
                        description={course.user ? course.user.bio : ""}
                        avatar={course.user ? course.user.avatarUrl : ""}
                        rating={4.2} // TODO :: to be compléted with rating service
                    />

                    <Separator className={"my-8"}/>

                    <div className="space-y-6">
                        <h2 className={"text-3xl font-semibold tracking-tight"}>Course Description</h2>
                        {course.tags.length > 0 && <div className=" flex flex-wrap gap-3 mt-4">
                            <span>Tags : </span>
                            {course.tags.map((tag, index) => (
                                <Badge className={"flex items-center gap-1 px-3 py-1"} key={tag.id}
                                       variant={"outline"}>
                                    {tag.title}
                                </Badge>
                            ))}
                        </div>}
                        <RenderDescription json={JSON.parse(course.description)}/>
                    </div>

                    <div className="py-8">
                        <ObjectivesAndRequisites requisites={course.prerequisites} objectives={course.objectives} />
                    </div>

                </div>
                <div className="mt-12 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className={"text-3xl font-semibold tracking-tight"}>Course Content</h2>
                        <div className="text-xs italic text-muted-foreground">
                            ( {course.chapters.length} ) chapters :
                            ( {course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)
                            || 0} ) lessons
                        </div>
                    </div>

                    <div className="space-y-4">
                        {course.chapters.map((chapter, index) => (
                            <Collapsible key={index} defaultOpen={index === 0}>
                                <Card
                                    className={"p-0 overflow-hidden duration-200 border-2 transition-all hover:shadow-md gap-0"}>
                                    <CollapsibleTrigger>
                                        <div className="">
                                            <CardContent className={"p-6 hover:bg-muted/50 transition-colors "}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <p className={"flex size-10 items-center justify-center rounded-full bg-primary/10  text-primary font-semibold"}>{index + 1}</p>
                                                        <div className="">
                                                            <h3 className={"text-xl font-semibold text-left"}>{chapter.title}</h3>
                                                            <p className={"text-sm text-muted-foreground mt-1 text-left"}>{chapter.lessons.length} lesson{chapter.lessons.length !== 1 ? 's' : ''}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant={"outline"} className={"text-xs"}>
                                                            {chapter.lessons.length} lesson{chapter.lessons.length !== 1 ? 's' : ''}
                                                        </Badge>
                                                        <IconChevronDown className={"size-5 text-muted-foreground"}/>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="border-t bg-muted/20">
                                            <div className="p-6 pt-4 space-y-3">
                                                {chapter.lessons.map((lesson, index) => {

                                                    return (hasAccess(lesson.publicAccess, course, isEnrolled) ?
                                                            <RenderLessonLinkItemList lesson={lesson} index={index}
                                                                                      chapter={chapter} key={index}
                                                                                      slug={course.slug}/>
                                                            :
                                                            <RenderLessonItemList lesson={lesson} index={index}
                                                                                  chapter={chapter} key={index}/>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enrollement Card*/}
            <div className="order-2 lg:col-span-1">
                <div className="sticky top-20">
                    <Card className={"py-0"}>
                        <CardContent className={"p-6"}>
                            <div className="flex items-center justify-between mb-6">
                                <span className={"text-lg font-medium"}>Price:</span>
                                <span className={"text-2xl font-bold text-primary"}>

                                    <ProductPrice finalPrice={finalPrice} price={course.price} size={"2xl"}/>
                                </span>
                            </div>

                            <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
                                <h4 className={"font-medium"}>What you will get:</h4>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <IconClock className={"size-4"}/>
                                        </div>
                                        <div className="">
                                            <p className={"text-sm font-medium"}>Course Duration</p>
                                            <p className={"text-sm text-muted-foreground"}>{course.duration} hours </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <IconChartBar className={"size-4"}/>
                                        </div>
                                        <div className="">
                                            <p className={"text-sm font-medium"}>Difficulty Level</p>
                                            <p className={"text-sm text-muted-foreground capitalize"}>{course.level.toLowerCase()} </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <IconCategory className={"size-4"}/>
                                        </div>
                                        <div className="">
                                            <p className={"text-sm font-medium"}>Category</p>
                                            <p className={"text-sm text-muted-foreground"}>{course.categoryTitle} </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <IconBook className={"size-4"}/>
                                        </div>
                                        <div className="">
                                            <p className={"text-sm font-medium"}>Total Lessons</p>
                                            <p className={"text-sm text-muted-foreground"}>
                                                {course.chapters.length} chapters  (
                                                {course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)
                                                    || 0 } lessons)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 space-Y-3 ">
                                <h4>This course includes:</h4>
                                <ul className={"space-y-2"}>
                                    <li className="flex items-center gap-2 text-sm">
                                        <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                                            <CheckIcon className={"size-3 "}/>
                                        </div>
                                        <span>
                                           Full lifetime access
                                       </span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                                            <CheckIcon className={"size-3 "}/>
                                        </div>
                                        <span>
                                          Access on mobile and desktop
                                       </span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                                            <CheckIcon className={"size-3 "}/>
                                        </div>
                                        <span>
                                          Certificate of completion
                                       </span>
                                    </li>
                                </ul>
                            </div>

                            {isEnrolled ?
                                <Link href={`/dashboard/courses/${course.slug}`} className={buttonVariants({className: "w-full mt-4", variant: "blue"})}>
                                    Watch Course
                                </Link>
                                :
                                course.price === 0 ?
                                    <p className={"text-xs text-muted-foreground mt-4 text-center"}>
                                        <EnrollmentButton courseId={course.id} courseTitle={course.title} btnLabel={"Enroll Free Course"} price={finalPrice}/>
                                    </p>
                                    : <>
                                        <EnrollmentButton courseId={course.id} courseTitle={course.title} btnLabel={"Enroll Now !"} price={finalPrice}/>
                                        <p className={"text-xs text-muted-foreground mt-4 text-center"}>
                                            30-day money-back guarantee.
                                        </p>
                                    </>
                            }

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
        ;
};

export default SingleCoursePage;


function RenderLessonItemList({lesson, index, chapter}: { lesson: any, index: number, chapter: any }) {
    const isLast = index === chapter.lessons.length - 1;
    const baseClasses =
        "flex items-center gap-4 p-2  rounded-lg bg-muted/50  transition-colors";
    const borderClass = isLast ? "" : "border-b border-dashed";
    const isPublicClass = lesson.publicAccess ? "hover:bg-green-300/10 cursor-pointer" : "hover:bg-muted/50";
    const sharedClasses = `${baseClasses} ${borderClass} ${isPublicClass}`;

    return <div key={index} className={sharedClasses}>
        <div
            className={` flex size-8 items-center justify-center rounded-full bg-background  border-2 ${lesson.publicAccess ? "border-green-800" : "border-primary/20"}`}>
            <IconPlayerPlay
                className={`size-4 ${lesson.publicAccess ? " text-green-600" : "text-muted-foreground"}  group-hover:text-primary transition-colors `}/>
        </div>
        <div className="flex-1">
            <p className={"font-medium text-sm"}>{lesson.title}</p>
            <p className={"text-xs text-muted-foreground mt-1"}>Lesson {index + 1}</p>
        </div>
        <div className="text-xs text-muted-foreground">
            {lesson.duration} sec
        </div>
    </div>

}

function RenderLessonLinkItemList({lesson, index, chapter, slug}: {
    lesson: any,
    index: number,
    chapter: any,
    slug: string
}) {
    const isLast = index === chapter.lessons.length - 1;
    const baseClasses =
        "flex items-center gap-4 p-2  rounded-lg bg-muted/50  transition-colors";
    const borderClass = isLast ? "" : "border-b border-dashed";
    const isPublicClass = lesson.publicAccess ? "hover:bg-green-300/10 cursor-pointer" : "hover:bg-muted/50";
    const sharedClasses = `${baseClasses} ${borderClass} ${isPublicClass}`;

    return <Link href={`/dashboard/courses/${slug}?lessonId=${lesson.id}`}
                 key={index} className={sharedClasses}>
        <div
            className={` flex size-8 items-center justify-center rounded-full bg-background  border-2 ${lesson.publicAccess ? "border-green-800" : "border-primary/20"}`}>
            <IconPlayerPlay
                className={`size-4 ${lesson.publicAccess ? " text-green-600" : "text-muted-foreground"}  group-hover:text-primary transition-colors `}/>
        </div>
        <div className="flex-1">
            <p className={"font-medium text-sm"}>{lesson.title}</p>
            <p className={"text-xs text-muted-foreground mt-1"}>Lesson {index + 1}</p>
        </div>
        <div className="text-xs text-muted-foreground">
            {lesson.duration} sec
        </div>
    </Link>

}
