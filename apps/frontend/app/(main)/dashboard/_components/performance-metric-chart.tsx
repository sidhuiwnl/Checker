"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { MetricData, MetricType } from "@/app/(main)/dashboard/types";
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";

type Props = {
    data: MetricData[];
    activeMetrics: MetricType[];
    metricColors: Record<MetricType, string>;
};

const filterOptions = ["Today", "Yesterday", "This Week", "This Month"] as const;
type FilterOption = (typeof filterOptions)[number];

export default function PerformanceMetricsChart({
                                                    data,
                                                    activeMetrics,
                                                    metricColors,
                                                }: Props) {
    const [selectedFilter, setSelectedFilter] = React.useState<FilterOption>("Today");

    const filteredData = React.useMemo(() => {
        return data.filter((item) => {
            const date = new Date(item.createdAt);
            switch (selectedFilter) {
                case "Today":
                    return isToday(date);
                case "Yesterday":
                    return isYesterday(date);
                case "This Week":
                    return isThisWeek(date);
                case "This Month":
                    return isThisMonth(date);
                default:
                    return true;
            }
        });
    }, [data, selectedFilter]);

    const chartData = React.useMemo(() => {
        return filteredData.map((item) => ({
            ...item,
            createdAtLabel: format(new Date(item.createdAt), "MMM d, hh:mm a"),
        }));
    }, [filteredData]);

    // Create chart config based on active metrics
    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {};
        activeMetrics.forEach((metric) => {
            config[metric] = {
                label: metric,
                color: metricColors[metric],
            };
        });
        return config;
    }, [activeMetrics, metricColors]);

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>
                        Showing performance metrics for {selectedFilter.toLowerCase()}
                    </CardDescription>
                </div>
                <Select
                    value={selectedFilter}
                    onValueChange={(value) => setSelectedFilter(value as FilterOption)}
                >
                    <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {filterOptions.map((option) => (
                            <SelectItem key={option} value={option} className="rounded-lg">
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <LineChart data={chartData}>
                        <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="createdAtLabel"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                            tickFormatter={(value) => `${value} ms`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => value}
                                    //@ts-ignore
                                    valueFormatter={(value) => `${value} ms`}
                                    indicator="dot"
                                />
                            }
                        />
                        {activeMetrics.map((metric) => (
                            <Line
                                key={metric}
                                type="monotone"
                                dataKey={metric}
                                stroke={`var(--color-${metric})`}
                                dot={false}
                                strokeWidth={2}
                            />
                        ))}

                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}