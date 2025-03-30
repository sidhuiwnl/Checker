import {MetricsLegendProps,MetricType} from "@/app/(main)/dashboard/[monitor]/types";

export default function MetricLegend({ activeMetrics, metricColors,toggleMetric } : MetricsLegendProps) {
    const metrics: MetricType[] = [
        "total",
        "latency",
        "tlsHandshake",
        "dataTransfer",
        "connection",
    ];
    return(
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {metrics.map((metric) => {
                const isActive = activeMetrics.includes(metric);

                return (
                    <button
                        key={metric}
                        onClick={() => toggleMetric(metric)}
                        className={`
              flex items-center gap-2 px-3 py-2 rounded-lg
              transition-all duration-200 ease-in-out
              ${isActive
                            ? 'border border-zinc-700 bg-zinc-800/50'
                            : 'border border-zinc-800 bg-zinc-900 opacity-50'
                        }
              hover:bg-zinc-800
            `}
                    >
                        <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: metricColors[metric] }}
                        />
                        <span className="text-sm whitespace-nowrap">
              {metric} (ms)
            </span>
                    </button>
                );
            })}
        </div>
    )
}