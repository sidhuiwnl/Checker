import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TooltipItem,
    ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
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


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


type TimeRange = 'today' | 'yesterday' | 'week' | 'month' | 'all';


const PerformanceMetricsChart = ({ data, activeMetrics, metricColors }: PerformanceMetricsChartProps) => {
    const chartRef = useRef<any>(null);
    const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(activeMetrics);
    const [timeRange, setTimeRange] = useState<TimeRange>('week');
    const patternCanvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());

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

    // Create stripe pattern for each metric
    const createPatterns = () => {
        selectedMetrics.forEach(metric => {
            const color = metricColors[metric];
            const patternKey = `pattern-${metric}`;

            // Create pattern canvas if it doesn't exist
            if (!patternCanvasRefs.current.has(patternKey)) {
                const canvas = document.createElement('canvas');
                canvas.width = 20;
                canvas.height = 20;
                patternCanvasRefs.current.set(patternKey, canvas);
            }

            const canvas = patternCanvasRefs.current.get(patternKey)!;
            const ctx = canvas.getContext('2d')!;

            // Clear canvas
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw pattern background
            ctx.fillStyle = hexToRgba(color, 0.5);
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw diagonal lines
            ctx.strokeStyle = hexToRgba(color, 1);
            ctx.lineWidth = 2;
            ctx.beginPath();

            // Draw diagonal lines
            for (let i = -20; i < 40; i += 8) {
                ctx.moveTo(i, 0);
                ctx.lineTo(i + 20, 20);
            }

            ctx.stroke();
        });
    };

    useEffect(() => {
        if (!chartRef.current) return;

        // Create stripe patterns
        createPatterns();

        // Update dataset styles
        chartRef.current.data.datasets.forEach((dataset: any) => {
            const metric = dataset.label as MetricType;
            const canvas = patternCanvasRefs.current.get(`pattern-${metric}`);

            if (canvas) {
                const pattern = chartRef.current.ctx.createPattern(canvas, 'repeat');
                dataset.backgroundColor = pattern;
                dataset.hoverBackgroundColor = hexToRgba(metricColors[metric], 0.9);
            }
        });

        chartRef.current.update();
    }, [selectedMetrics, metricColors, filteredData]);

    const chartOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
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
            x: { grid: { color: "rgba(75, 85, 99, 0.1)" }, ticks: { color: "#ddd", maxTicksLimit: 10 } },
            y: { grid: { color: "rgba(75, 85, 99, 0.1)" }, ticks: { color: "#ddd", callback: value => `${value} ms` } },
        },
        elements: { bar: { borderRadius: 4, borderSkipped: "end", borderWidth: 1 } },
    };

    const chartData = {
        labels: aggregatedLabels,
        datasets: selectedMetrics.map(metric => ({
            label: metric,
            data: aggregatedData.map(d => d[metric]),
            // Initial backgroundColor - will be replaced with pattern in useEffect
            backgroundColor: hexToRgba(metricColors[metric], 0.7),
            hoverBackgroundColor: hexToRgba(metricColors[metric], 0.9),
            borderColor: metricColors[metric],
        })),
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between mb-4">
                <div className="flex flex-wrap gap-2">

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
                <Bar ref={chartRef} options={chartOptions} data={chartData} />
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