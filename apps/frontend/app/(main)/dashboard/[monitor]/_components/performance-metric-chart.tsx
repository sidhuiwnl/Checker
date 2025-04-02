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
import { MetricType, PerformanceMetricsChartProps } from "../types";
import { formatDate, hexToRgba } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const PerformanceMetricsChart = ({
                                     data,
                                     activeMetrics,
                                     metricColors,
                                 }: PerformanceMetricsChartProps) => {
    const chartRef = useRef<any>(null);
    const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(activeMetrics);

    // Toggle metric selection
    const toggleMetric = (metric: MetricType) => {
        setSelectedMetrics(prev =>
            prev.includes(metric)
                ? prev.filter(m => m !== metric)
                : [...prev, metric]
        );
    };

    // Aggregate data by week/month when there are too many points
    const { aggregatedLabels, aggregatedData } = useMemo(() => {
        const pointThreshold = 30;
        const dayThreshold = 90;

        if (data.length <= pointThreshold) {
            return {
                aggregatedLabels: data.map(d => formatDate(d.createdAt)),
                aggregatedData: data
            };
        }

        const firstDate = new Date(data[0].createdAt);
        const lastDate = new Date(data[data.length - 1].createdAt);
        const dayDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24);

        const aggregateByWeek = dayDiff > dayThreshold;

        const groups: Record<string, typeof data> = {};

        data.forEach(item => {
            const date = new Date(item.createdAt);
            let groupKey: string;

            if (aggregateByWeek) {
                const year = date.getFullYear();
                const week = getWeekNumber(date);
                groupKey = `${year}-W${week.toString().padStart(2, '0')}`;
            } else {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const week = Math.floor(date.getDate() / 7) + 1;
                groupKey = `${year}-${month.toString().padStart(2, '0')}-W${week}`;
            }

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
        });

        const aggregatedLabels = Object.keys(groups).map(key => {
            if (aggregateByWeek) {
                const [year, week] = key.split('-W');
                return `Week ${week}, ${year}`;
            } else {
                const [year, month, week] = key.split('-');
                return `${month}/${year} (Week ${week})`;
            }
        });

        const aggregatedData = Object.values(groups).map(group => {
            const sum = group.reduce((acc, curr) => {
                const metrics = {} as any;
               activeMetrics.forEach(metric => {
                    metrics[metric] = (acc[metric] || 0) + curr[metric];
                });
                return metrics;
            }, {} as any);

            const avg = {} as any;
            activeMetrics.forEach(metric => {
                avg[metric] = Math.round(sum[metric] / group.length);
            });

            return avg;
        });

        return { aggregatedLabels, aggregatedData };
    }, [data, activeMetrics]);

    function getWeekNumber(date: Date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
        const week1 = new Date(d.getFullYear(), 0, 4);
        return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        chart.data.datasets.forEach((dataset: any, i: number) => {
            const metric = dataset.label as MetricType;
            if (!metric || !metricColors[metric]) return;

            dataset.backgroundColor = hexToRgba(metricColors[metric], 0.7);
            dataset.hoverBackgroundColor = hexToRgba(metricColors[metric], 0.9);
        });

        chart.update();
    }, [selectedMetrics, metricColors, data]);

    const chartOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 800,
            easing: "easeOutQuart",
        },
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "rgba(75, 85, 99, 0.3)",
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 14,
                    weight: "bold",
                },
                callbacks: {
                    title: (tooltipItems: TooltipItem<"bar">[]) => {
                        return tooltipItems[0].label;
                    },
                    label: (tooltipItem: TooltipItem<"bar">) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw} ms (avg)`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: "rgba(75, 85, 99, 0.1)",
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: "rgba(255, 255, 255, 0.7)",
                    font: {
                        size: 12,
                    },
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: true,
                    maxTicksLimit: 10,
                },
                stacked: false,
            },
            y: {
                position: "right",
                grid: {
                    display: true,
                    color: "rgba(75, 85, 99, 0.1)",
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: "rgba(255, 255, 255, 0.7)",
                    font: {
                        size: 12,
                    },
                    callback: (value: number | string) => `${value} ms`,
                },
                stacked: false,
            },
        },
        elements: {
            bar: {
                borderRadius: 4,
                borderWidth: 0,
                borderSkipped: 'end',
            },
        },
    };

    const chartData = {
        labels: aggregatedLabels,
        datasets: selectedMetrics.map((metric) => ({
            label: metric,
            data: aggregatedData.map((d) => d[metric]),
            backgroundColor: hexToRgba(metricColors[metric], 0.7),
            borderColor: metricColors[metric],
            borderWidth: 0,
            hoverBackgroundColor: hexToRgba(metricColors[metric], 0.9),
        })),
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-end mb-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Filter Metrics
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {activeMetrics.map((metric) => (
                            <DropdownMenuCheckboxItem
                                key={metric}
                                checked={selectedMetrics.includes(metric)}
                                onCheckedChange={() => toggleMetric(metric)}
                                className="capitalize"
                            >
                                {metric}
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

export default PerformanceMetricsChart;