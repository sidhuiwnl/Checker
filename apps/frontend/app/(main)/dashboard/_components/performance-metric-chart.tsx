import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TooltipItem,
    ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useRef, useEffect, useMemo, useState } from "react";
import {MetricType,PerformanceMetricsChartProps} from "@/app/(main)/dashboard/types";
import { hexToRgba } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format, startOfToday, subDays, subWeeks, subMonths, getISOWeek, parseISO } from "date-fns";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);


type TimeRange = 'today' | 'yesterday' | 'week' | 'month' | 'all';


const PerformanceMetricsChart = ({ data, activeMetrics, metricColors }: PerformanceMetricsChartProps) => {
    const chartRef = useRef<any>(null);
    const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(activeMetrics);
    const [timeRange, setTimeRange] = useState<TimeRange>('week');

    const filteredData = useMemo(() => {
        const now = new Date();
        const today = startOfToday();

        switch (timeRange) {
            case 'today':
                return data.filter(item => parseISO(item.createdAt) >= today);
            case 'yesterday':
                const yesterday = subDays(today, 1);
                return data.filter(item => {
                    const date = parseISO(item.createdAt);
                    return date >= yesterday && date < today;
                });
            case 'week':
                const weekStart = subWeeks(today, 1);
                return data.filter(item => parseISO(item.createdAt) >= weekStart);
            case 'month':
                const monthStart = subMonths(today, 1);
                return data.filter(item => parseISO(item.createdAt) >= monthStart);
            default:
                return data;
        }
    }, [data, timeRange]);

    const { aggregatedLabels, aggregatedData } = useMemo(() => {
        if (filteredData.length === 0) return { aggregatedLabels: [], aggregatedData: [] };

        const groupBy = (getKey: (date: Date) => string) => {
            const groups: Record<string, typeof filteredData> = {};
            filteredData.forEach(item => {
                const date = parseISO(item.createdAt);
                const key = getKey(date);
                if (!groups[key]) groups[key] = [];
                groups[key].push(item);
            });
            return groups;
        };

        let labels: string[], aggregated: Record<MetricType, number>[];

        if (timeRange === 'today' || timeRange === 'yesterday') {
            const hourlyGroups = groupBy(date => format(date, "HH:00"));

            labels = Object.keys(hourlyGroups).sort();
            aggregated = labels.map(label => {
                const group = hourlyGroups[label];
                return activeMetrics.reduce((acc, metric) => {
                    acc[metric] = Math.round(group.reduce((sum, item) => sum + item[metric], 0) / group.length);
                    return acc;
                }, {} as Record<MetricType, number>);
            });

            labels = labels.map(label => `${label}-${String(Number(label.split(':')[0]) + 1).padStart(2, '0')}:00`);
        } else if (timeRange === 'week') {
            const dailyGroups = groupBy(date => format(date, "EEE"));

            labels = Object.keys(dailyGroups).sort();
            aggregated = labels.map(key => {
                const group = dailyGroups[key];
                return activeMetrics.reduce((acc, metric) => {
                    acc[metric] = Math.round(group.reduce((sum, item) => sum + item[metric], 0) / group.length);
                    return acc;
                }, {} as Record<MetricType, number>);
            });
        } else {
            const weeklyGroups = groupBy(date => `Week ${getISOWeek(date)}, ${format(date, "yyyy")}`);

            labels = Object.keys(weeklyGroups);
            aggregated = labels.map(key => {
                const group = weeklyGroups[key];
                return activeMetrics.reduce((acc, metric) => {
                    acc[metric] = Math.round(group.reduce((sum, item) => sum + item[metric], 0) / group.length);
                    return acc;
                }, {} as Record<MetricType, number>);
            });
        }

        return { aggregatedLabels: labels, aggregatedData: aggregated };
    }, [filteredData, activeMetrics, timeRange]);

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#ddd',
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "rgba(75, 85, 99, 0.3)",
                borderWidth: 1,
                titleFont: { size: 14, weight: "bold" },
                callbacks: {
                    title: tooltipItems => tooltipItems[0].label,
                    label: tooltipItem => `${tooltipItem.dataset.label}: ${tooltipItem.raw} ms (avg)`,
                },
            },
        },
        scales: {
            x: {
                grid: { color: "rgba(75, 85, 99, 0.1)" },
                ticks: { color: "#ddd", maxTicksLimit: 10 }
            },
            y: {
                grid: { color: "rgba(75, 85, 99, 0.1)" },
                ticks: { color: "#ddd", callback: value => `${value} ms` }
            },
        },
        elements: {
            line: {
                tension: 0.3, // Adds slight curve to the lines
                borderWidth: 2,
            },
            point: {
                radius: 4,
                hoverRadius: 6,
                borderWidth: 2
            }
        },
    };

    const chartData = {
        labels: aggregatedLabels,
        datasets: selectedMetrics.map(metric => ({
            label: metric,
            data: aggregatedData.map(d => d[metric]),
            borderColor: metricColors[metric],
            backgroundColor: hexToRgba(metricColors[metric], 0.1),
            pointBackgroundColor: metricColors[metric],
            pointBorderColor: '#fff',
            fill: true,
        })),
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                    {/* You can add metric selection buttons here if needed */}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">{formatTimeRangeLabel(timeRange)}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        {['today', 'yesterday', 'week', 'month', 'all'].map(range => (
                            <DropdownMenuCheckboxItem
                                key={range}
                                checked={timeRange === range}
                                onCheckedChange={() => setTimeRange(range as TimeRange)}
                            >
                                {formatTimeRangeLabel(range as TimeRange)}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex-1">
                <Line ref={chartRef} options={chartOptions} data={chartData} />
            </div>
        </div>
    );
};

const formatTimeRangeLabel = (range: TimeRange) => ({
    today: "Today",
    yesterday: "Yesterday",
    week: "This Week",
    month: "This Month",
    all: "All Time",
}[range]);

export default PerformanceMetricsChart;