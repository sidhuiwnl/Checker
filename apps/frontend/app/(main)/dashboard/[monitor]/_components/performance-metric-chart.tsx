import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    TooltipItem,
    ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useRef, useEffect } from "react";
import { MetricType, PerformanceMetricsChartProps } from "../types";
import {formatDate} from "@/lib/utils";
import {hexToRgba} from "@/lib/utils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);




const PerformanceMetricsChart = ({
                                     data,
                                     activeMetrics,
                                     metricColors,
                                 }: PerformanceMetricsChartProps) => {
    const chartRef = useRef<any>(null);



    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        const { ctx, chartArea } = chart;
        if (!ctx || !chartArea) return;


        chart.data.datasets.forEach((dataset: any, i: number) => {
            const metric = dataset.label as MetricType;


            if (!metric || !metricColors[metric]) return;

            const gradient = ctx.createLinearGradient(
                0,
                chartArea.bottom,
                0,
                chartArea.top
            );


            gradient.addColorStop(0, hexToRgba(metricColors[metric], 0.05));
            gradient.addColorStop(1, hexToRgba(metricColors[metric], 0.4));

            dataset.backgroundColor = gradient;
        });

        chart.update();
    }, [activeMetrics, metricColors, data]);

    const chartOptions: ChartOptions<"line"> = {
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
                    title: (tooltipItems: TooltipItem<"line">[]) => {
                        return tooltipItems[0].label;
                    },
                    label: (tooltipItem: TooltipItem<"line">) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw} ms`;
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
                },
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
            },
        },
        elements: {
            line: {
                tension: 0.4,
            },
            point: {
                radius: 0,
                hoverRadius: 4,
            },
        },
    };

    const chartData = {
        labels: data.map((d) => formatDate(d.createdAt)),
        datasets: activeMetrics.map((metric) => ({
            label: metric,
            data: data.map((d) => d[metric]),
            borderColor: metricColors[metric],
            backgroundColor: hexToRgba(metricColors[metric], 0.2),
            borderWidth: 2,
            fill: true,
            pointBackgroundColor: metricColors[metric],
        })),
    };

    return <Line ref={chartRef} options={chartOptions} data={chartData} />;
};

export default PerformanceMetricsChart;
