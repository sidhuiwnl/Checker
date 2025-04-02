"use client"

import MetricLegend from "@/app/(main)/dashboard/[monitor]/_components/metric-legend";
import {MetricType} from "@/app/(main)/dashboard/[monitor]/types";
import {useState} from "react";
import PerformanceMetricsChart from "@/app/(main)/dashboard/[monitor]/_components/performance-metric-chart";
import {MetricData} from "@/app/(main)/dashboard/[monitor]/types";
import MetricsHeader from "@/app/(main)/dashboard/[monitor]/_components/metrics-header";




type Props = {
    chartData : MetricData[];
    url : string;
    status : "GOOD" | "BAD"
}

const metricColors: Record<MetricType, string> = {
    "total": "#34D399",
    latency: "#F87171",
    "tlsHandshake": "#60A5FA",
    "dataTransfer": "#FBBF24",
    connection: "#F97316",
};


export default function Chart({ chartData,url,status } : Props){


    const [activeMetrics, setActiveMetrics] = useState<MetricType[]>([
        "total",
        "latency",
        "tlsHandshake",
        "dataTransfer",
        "connection",
    ]);

    const toggleMetric = (metric: MetricType) => {
        if (activeMetrics.includes(metric)) {
            // Don't allow deselecting if it's the last active metric
            if (activeMetrics.length === 1) return;

            setActiveMetrics(activeMetrics.filter((m) => m !== metric));
        } else {
            setActiveMetrics([...activeMetrics, metric]);
        }
    };

    return(
        <div className="text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mt-6 bg-zinc-900 rounded-xl p-4 md:p-6 border border-zinc-800">
                    <MetricsHeader url={url} status={status} />
                    <div className="h-[400px] mb-6">
                        <PerformanceMetricsChart
                            data={chartData}
                            activeMetrics={activeMetrics}
                            metricColors={metricColors}
                        />
                    </div>

                    <MetricLegend
                        metricColors={metricColors}
                        activeMetrics={activeMetrics}
                        toggleMetric={toggleMetric}
                    />
                </div>
            </div>
        </div>
    )
}