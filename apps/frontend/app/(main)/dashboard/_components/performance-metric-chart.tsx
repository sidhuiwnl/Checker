"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { MetricData, MetricType } from "@/app/(main)/dashboard/types";
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { useMemo, useState } from "react";

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
    const [selectedFilter, setSelectedFilter] = useState<FilterOption>("Today");

    const filteredData = useMemo(() => {
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

    const chartData = useMemo(() => {
        return filteredData.map((item) => ({
            ...item,
            createdAtLabel: format(new Date(item.createdAt), "MMM d, hh:mm a"),
        }));
    }, [filteredData]);

    return (
        <div className="relative w-full h-full">
            {/* Dropdown */}
            <div className="absolute top-2 right-2 z-10">
                <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value as FilterOption)}
                    className="bg-zinc-800 text-white text-sm px-3 py-1 rounded-md border border-zinc-700"
                >
                    {filterOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <XAxis
                        dataKey="createdAtLabel"
                        stroke="#ccc"
                        tick={{ fill: "#aaa", fontSize: 12 }}
                        angle={0}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        stroke="#ccc"
                        tick={{ fill: "#aaa", fontSize: 12 }}
                        tickFormatter={(value) => `${value} ms`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "none",
                            color: "#fff",
                        }}
                        labelStyle={{ color: "#fff" }}
                        formatter={(value: number, name: string) => [`${value} ms`, name]}
                    />
                    {activeMetrics.map((metric) => (
                        <Line
                            key={metric}
                            type="monotone"
                            dataKey={metric}
                            stroke={metricColors[metric]}
                            dot={false}
                            strokeWidth={2}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
