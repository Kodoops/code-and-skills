import {
    IconBook,
} from "@tabler/icons-react"

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {Package2Icon, RouteIcon, ToolCaseIcon} from "lucide-react";
import {userGetDashboardStats} from "@/actions/admin/user";

export async function SectionCards() {

    const {
        totalEnrollments,totalPathsEnrollments,totalCoursesEnrollments, totalWorkshopsEnrollments
    } = await userGetDashboardStats();

    return (
        <div  className={"my-4"}>
            <div
                className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <Card className="@container/card">
                    <CardHeader className="flex flex-row items-center justify-between gp-2 space-y-0">
                        <div className="">
                            <CardDescription>Total Enrollments</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {totalEnrollments}
                            </CardTitle>
                        </div>
                        <Package2Icon className="size-6 text-muted-foreground"/>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <p className={"text-muted-foreground"}>Your total enrollments on the platform</p>
                    </CardFooter>
                </Card>
                <Card className="@container/card">
                    <CardHeader className="flex flex-row items-center justify-between gp-2 space-y-0">
                        <div className="">
                            <CardDescription>Total Learning Paths enrollments</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {totalPathsEnrollments}
                            </CardTitle>
                        </div>
                        <RouteIcon className="size-6 text-muted-foreground"/>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <p className={"text-muted-foreground"}>Your total learning paths enrollments on the platform</p>
                    </CardFooter>
                </Card>
                <Card className="@container/card">
                    <CardHeader className="flex flex-row items-center justify-between gp-2 space-y-0">
                        <div className="">
                            <CardDescription>Total Courses Enrollments </CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {totalCoursesEnrollments}
                            </CardTitle>
                        </div>
                        <IconBook className="size-6 text-muted-foreground"/>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <p className={"text-muted-foreground"}>Your total courses enrollments on the platform</p>
                    </CardFooter>
                </Card>
                <Card className="@container/card">
                    <CardHeader className="flex flex-row items-center justify-between gp-2 space-y-0">
                        <div className="">
                            <CardDescription>Total Workshops enrollments</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {totalWorkshopsEnrollments}
                            </CardTitle>
                        </div>
                        <ToolCaseIcon className="size-6 text-muted-foreground"/>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <p className={"text-muted-foreground"}>Your total workshops enrollments on the platform</p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
