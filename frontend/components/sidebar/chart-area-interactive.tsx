"use client"

import * as React from "react"
import {Bar, BarChart, CartesianGrid, XAxis} from "recharts"

import {useIsMobile} from "@/hooks/use-mobile"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {useMemo} from "react";


const chartConfig = {
    enrollments: {
        label: 'Enrollments',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig

interface Props {
    data: {
        date: string,
        enrollments: number
    }[],
}

export function ChartAreaInteractive({data}: Props) {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState("90d")

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d")
        }
    }, [isMobile])

    const totalEnrollmentsNumber =useMemo(() => {
        return data.reduce((acc, item) => acc + item.enrollments, 0)
    },[data]);

    console.log(timeRange);

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Total Enrollments</CardTitle>
                <CardDescription>
          <span className={"hidden @[540px]/card:block "}>
            Total Enrollments for the last 30 days :  {totalEnrollmentsNumber}
          </span>
                    <span className={"@[540px]/card:hidden"}>
            Last 30 days: {totalEnrollmentsNumber}
          </span>
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer className={"aspect-auto h-[250px] w-full"} config={chartConfig}>
                    <BarChart margin={{
                        left: 12, right: 12,
                    }} data={data}>
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={"preserveStartEnd"}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("fr-FR", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />

                        <ChartTooltip content={<ChartTooltipContent
                            className={"w-[150px]"}
                            labelFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("fr-FR", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />}
                        />
                        <Bar dataKey="enrollments" fill={chartConfig.enrollments.color}/>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
