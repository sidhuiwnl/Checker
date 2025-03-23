"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface WebsiteProps {
    id: string;
    createdAt: string;
    status: string;
    latency: number;
    total: number;
    tlsHandshake: number;
    dataTransfer: number;
    connection: number;
}

type Props = {
    websiteTicks: WebsiteProps[]
}

const chartConfig = {
    total: {
        label: "Total Load Time (ms)",
        color: "hsl(var(--chart-1))",
    },
    latency: {
        label: "Latency (ms)",
        color: "hsl(var(--chart-2))",
    },
    tlsHandshake: {
        label: "TLS Handshake (ms)",
        color: "hsl(var(--chart-3))",
    },
    dataTransfer: {
        label: "Data Transfer (ms)",
        color: "hsl(var(--chart-4))",
    },
    connection: {
        label: "Connection (ms)",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export function Component({ websiteTicks } : Props) {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = websiteTicks.filter((item) => {
        const date = new Date(item.createdAt)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Area Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing website performance metrics in milliseconds
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            {Object.keys(chartConfig).map((key) => (
                                <linearGradient id={`fill${key}`} x1="0" y1="0" x2="0" y2="1" key={key}>
                                    <stop
                                        offset="5%"
                                        stopColor={`var(--color-${key})`}
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={`var(--color-${key})`}
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="createdAt"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <YAxis tickFormatter={(value) => `${value} ms`} />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        {Object.keys(chartConfig).map((key) => (
                            <Area
                                key={key}
                                dataKey={key}
                                type="natural"
                                fill={`url(#fill${key})`}
                                stroke={`var(--color-${key})`}
                                stackId="a"
                            />
                        ))}
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
