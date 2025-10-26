import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Check, PlayIcon} from "lucide-react";

interface LessonItemProps {
    lesson: {
        id: string;
        title: string;
        position: number;
        description: string | null;
        publicAccess: boolean;
    };
    slug: string;
    isActive?: boolean;
    completed?: boolean;
}

export function LessonItem({lesson, slug, isActive, completed}: LessonItemProps) {

    return (
        <div className={buttonVariants({
            variant: completed ? "secondary" : "outline",
            className: cn(
                "w-full p-2.5 h-auto justify-start transition-all",
                completed && "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200",
                isActive && !completed && "bg-primary/10 dark:bg-primary/20 border-primary/50  hover:bg-primary/20 dark:hover:primary/30 text-primary ",
            )
        })}
        >
            <div className="flex items-center gap-2.5 w-full min-w-0">
                <div className="shrink-0">
                    {
                        completed ? (
                            <div
                                className={"size-5 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center"}>
                                <Check className={cn("size-3 text-white ")}/>
                            </div>
                        ) : (
                            <div className={cn("size-5 rounded-full bg-background flex items-center justify-center",
                                isActive ? "border-primary bg-primary/10 dark:bg-primary/20" :
                                    " border-muted-foreground/60 ",
                            )}>
                                <PlayIcon className={cn("size-2.5 fill-current",
                                    isActive ? "text-primary" : "text-primary-foreground",
                                )}/>
                            </div>
                        )
                    }

                </div>
                <div className={"flex-1 text-left min-w-0"}>
                    <p className={cn("text-xs font-medium truncate", completed ? "text-green-800 dark:text-green-200" :
                        isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                        {lesson.position}. {lesson.title}
                    </p>
                    {completed && <p className={"text-xs text-green-700 dark:text-green-300 font-medium"}>completed</p>}
                    {isActive && !completed &&
                        <p className={"text-[10px] text-primary font-medium"}>Currently watching</p>}
                </div>
            </div>
        </div>
    )
}


export function LessonLinkItem({lesson, slug, isActive, completed}: LessonItemProps) {

    return (
        <Link className={buttonVariants({
            variant: completed ? "secondary" : "outline",
            className: cn(
                "w-full p-2.5 h-auto justify-start transition-all",
                completed && "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200",
                isActive && !completed && "bg-primary/10 dark:bg-primary/20 border-primary/50  hover:bg-primary/20 dark:hover:primary/30 text-primary ",
            )
        })}
              href={`/dashboard/courses/${slug}/${lesson.id}`}
        >
            <div className="flex items-center gap-2.5 w-full min-w-0">
                <div className="shrink-0">
                    {
                        completed ? (
                            <div
                                className={"size-5 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center"}>
                                <Check className={cn("size-3 text-white ")}/>
                            </div>
                        ) : (
                            <div className={cn("size-5 rounded-full bg-background flex items-center justify-center",
                                isActive ? "border-primary bg-primary/10 dark:bg-primary/20" :
                                    " border-muted-foreground/60 ",
                                "border-primary bg-primary/10 dark:bg-primary/20"
                            )}>
                                <PlayIcon className={cn("size-2.5 fill-current",
                                    isActive ? "text-primary" : "text-primary-foreground",
                                    "text-primary"
                                )}/>
                            </div>
                        )
                    }

                </div>
                <div className={"flex-1 text-left min-w-0"}>
                    <p className={cn("text-xs font-medium truncate", completed ? "text-green-800 dark:text-green-200" :
                        isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                        {lesson.position}. {lesson.title}
                    </p>
                    {completed && <p className={"text-xs text-green-700 dark:text-green-300 font-medium"}>completed</p>}
                    {isActive && !completed &&
                        <p className={"text-[10px] text-primary font-medium"}>Currently watching</p>}
                </div>
            </div>
        </Link>
    )
}
