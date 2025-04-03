export type MetricType =
    | "total"
    | "latency"
    | "tlsHandshake"
    | "dataTransfer"
    | "connection";

export interface MetricData {
    createdAt: string;
    total: number;
    latency: number;
    tlsHandshake: number;
    dataTransfer: number;
    connection: number;

}

export interface MetricsLegendProps {
    metricColors: Record<MetricType, string>;
    activeMetrics: MetricType[];
    toggleMetric: (metric: MetricType) => void;
}

export interface PerformanceMetricsChartProps {
    data: MetricData[];
    activeMetrics: MetricType[];
    metricColors: Record<MetricType, string>;
}