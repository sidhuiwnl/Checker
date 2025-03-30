"use client"

import useWebsite from "@/hooks/useWebsite";
import  Chart  from "@/app/(main)/dashboard/[monitor]/_components/chart";

import MetricsHeader from "@/app/(main)/dashboard/[monitor]/_components/metrics-header";

type Props = {
    monitor : string;
};

export  function ChartParent({ monitor }: Props) {
    const website  = useWebsite(monitor);

    const status : "GOOD" | "BAD" | undefined = website?.websiteTick[website?.websiteTick.length - 1].status;

    console.log(website?.websiteTick);

    const chartData = website?.websiteTick.map(({
                                                    createdAt,
                                                    total,
                                                    latency,
                                                    tlsHandshake,
                                                    dataTransfer,
                                                    connection,

                                                }) => ({
        createdAt,
        total,
        latency,
        tlsHandshake,
        dataTransfer,
        connection,

    }));



    return(
        <div className="w-full h-screen p-6">
            { chartData ? (
                <Chart
                    url={website?.url as string}
                    status={status!}
                    chartData={chartData}
                />
            ) : (
                <div>No data</div>
            ) }
        </div>
    )
}